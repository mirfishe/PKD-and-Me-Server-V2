const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const emailRegExp = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const controllerName = "user";
const tableName = "users";
const select = "*";
const orderBy = [{ column: "lastName", order: "desc" }, { column: "firstName", order: "desc" }];


/* ***********************************
 *** User Registration ***************
*********************************** */
router.post("/register", (req, res) => {

  const createUser = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password)
  };

  if (req.body.user.email.match(emailRegExp)) {

    User.create(createUser)
      .then(
        createSuccess = (user) => {
          let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
          res.json({
            // ? Need to return all the properties of the user to the browser?
            // user:   user,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            updatedBy: user.updatedBy,
            admin: user.admin,
            active: user.active,
            isLoggedIn: true,
            isAdmin: user.admin,
            recordAdded: true,
            message: "User successfully created " + tableName + ".",
            sessionToken: token
          });
        },
        createError = (err) => {
          // console.log(controllerName + "-controller post /register createError err", err);
          // console.log(controllerName + "-controller post /register createError err.name", err.name);
          // console.log(controllerName + "-controller post /register createError err.errors[0].message", err.errors[0].message);

          let errorMessages = "";
          for (let i = 0; i < err.errors.length; i++) {
            //console.log(controllerName + "-controller post /register createError err.errors[i].message", err.errors[i].message);
            if (i > 1) {
              errorMessages = errorMessages + ", ";
            };
            errorMessages = errorMessages + err.errors[i].message;
          };

          res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "Not successfully registered " + tableName + ".", errorMessages: errorMessages, error: err });
        })
      .catch(err => {
        console.log(controllerName + "-controller post /register err", err);
        res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "Not successfully registered " + tableName + ".", error: err });
      });

  } else {
    res.status(200).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "Please provide a valid email address." });
  };

});


/* ***********************************
 *** User Login **********************
*********************************** */
router.post("/login", (req, res) => {

  const query = {
    where: {
      [Op.and]: [
        { email: { [Op.eq]: req.body.user.email } },
        { active: { [Op.eq]: true } }
      ]
    }
  };

  User.findOne(query)
    .then(
      loginSuccess = (user) => {
        if (user) {
          bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
            if (matches) {
              let token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
              res.status(200).json({
                // ? Need to return all the properties of the user to the browser?
                // user:   user,
                userID: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                updatedBy: user.updatedBy,
                admin: user.admin,
                active: user.active,
                isLoggedIn: true,
                isAdmin: user.admin,
                resultsFound: true,
                message: "Successfully authenticated user.",
                sessionToken: token
              });
            } else {
              console.log(controllerName + "-controller post /login Login failed. 401");
              res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: "Login failed." });
            };
          });
        } else {
          // console.log(controllerName + "-controller post /login Failed to authenticate. 401");
          res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to authenticate.", error: "Failed to authenticate." });
        };
      },
      err => {
        console.log(controllerName + "-controller post /login Failed to process. 501 err", err);
        res.status(501).send({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to process.", error: "Failed to process." });
      }
    )
    .catch(err => {
      console.log(controllerName + "-controller post /login err", err);
      res.status(500).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: err });
    });
});


/******************************
 ***** Get Users *****
 ******************************/
// * Allows an admin to view all the users
router.get("/admin", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy([{ column: "lastName", order: "desc" }, { column: "firstName", order: "desc" }])
    .then((users) => {

      if (users.length > 0) {
        // console.log(controllerName + "-controller get /admin users", users);

        res.status(200).json({ users: users, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /admin No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /admin err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// * Returns User information for the logged in user
router.get("/", validateSession, (req, res) => {

  db.select(select)
    .from(tableName)
    .where({ userID: req.user.userID })
    .then((user) => {

      // if (user.length > 0) {
      if (user != null) {
        // console.log(controllerName + "-controller get / user", user);

        // res.status(200).json({users: users, resultsFound: true, message: "Successfully retrieved " + tableName + "."});
        res.status(200).json({
          // ? Need to return all the properties of the user to the browser?
          // user:   user,
          userID: user.userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          updatedBy: user.updatedBy,
          admin: user.admin,
          active: user.active,
          resultsFound: true,
          message: "Successfully retrieved user information."
        });

      } else {
        // console.log(controllerName + "-controller get / No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// Returns User information for the admin
router.get("/:userID", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .where({ userID: req.params.userID })
    .then((user) => {

      // if (user.length > 0) {
      if (user != null) {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID user", user);

        // res.status(200).json({users: users, resultsFound: true, message: "Successfully retrieved " + tableName + "."});
        res.status(200).json({
          // ? Need to return all the properties of the user to the browser?
          // user:   user,
          userID: user.userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          updatedBy: user.updatedBy,
          admin: user.admin,
          active: user.active,
          resultsFound: true,
          message: "Successfully retrieved user information."
        });

      } else {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /:" + controllerName + "ID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows an admin to update the user data including soft delete it
// * The admin column is not included here as an extra security feature
router.put("/:userID", validateAdmin, (req, res) => {

  const updateUser = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    updatedBy: req.user.userID,
    active: req.body.user.active
  };

  // If the user doesn't enter a password, then it isn't updated
  if (req.body.user.password) {
    Object.assign(updateUser, { password: bcrypt.hashSync(req.body.user.password) });
  };

  const query = {
    where: {
      userID: { [Op.eq]: req.params.userID }
    }
  };

  if (req.body.user.email.match(emailRegExp)) {

    User.update(updateUser, query)
      // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated.
      .then((user) => {
        if (user > 0) {
          res.status(200).json({
            // ? Need to return all the properties of the user to the browser?
            // user:   user,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            updatedBy: user.updatedBy,
            admin: user.admin,
            active: user.active,
            recordUpdated: true,
            message: user + " user record(s) successfully updated."
          });
        } else {
          res.status(200).json({ recordUpdated: false, message: user + " user record(s) successfully updated." });
        };
      })
      .catch((err) => {
        console.log(controllerName + "-controller put /:" + controllerName + "ID err", err);
        // console.log(controllerName + "-controller put /:" + controllerName + "ID err.name", err.name);
        // console.log(controllerName + "-controller put /:" + controllerName + "ID err.errors[0].message", err.errors[0].message);

        let errorMessages = "";
        for (let i = 0; i < err.errors.length; i++) {
          //console.log(controllerName + "-controller put /:" + controllerName + "ID err.errors[i].message", err.errors[i].message);
          if (i > 1) {
            errorMessages = errorMessages + ", ";
          };
          errorMessages = errorMessages + err.errors[i].message;
        };

        res.status(500).json({ recordUpdated: false, message: "User not successfully updated.", errorMessages: errorMessages, error: err });
      });

  } else {
    res.status(200).json({ recordUpdated: false, message: "Please provide a valid email address." });
  };

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows a user to update their own record including soft delete it
// * The admin column is not included here as an extra security feature
router.put("/", validateSession, (req, res) => {

  const updateUser = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    updatedBy: req.user.userID,
    active: req.body.user.active
  };

  // * If the user doesn't enter a password, then it isn't updated
  if (req.body.user.password) {
    Object.assign(updateUser, { password: bcrypt.hashSync(req.body.user.password) });
  };

  const query = {
    where: {
      userID: { [Op.eq]: req.user.userID }
    }
  };

  if (req.body.user.email.match(emailRegExp)) {

    User.update(updateUser, query)
      .then(
        updateSuccess = (user) => {
          if (user > 0) {
            // let token = jwt.sign({userID: user.userID}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.json({
              // ? Need to return all the properties of the user to the browser?
              // user:   user,
              userID: user.userID,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              updatedBy: user.updatedBy,
              admin: user.admin,
              active: user.active,
              isLoggedIn: true,
              recordUpdated: true,
              message: user + " user record(s) successfully updated.",
              // sessionToken:   token // User gets a new sessionToken even if they haven't updated their password
            });
          } else {
            res.status(200).json({ recordUpdated: false, isLoggedIn: true, message: user + " user record(s) successfully updated." });
          };
        },
        updateError = (err) => {
          console.log(controllerName + "-controller put / err", err);
          // console.log(controllerName + "-controller put / err.name", err.name);
          // console.log(controllerName + "-controller put / err.errors[0].message", err.errors[0].message);

          let errorMessages = "";
          for (let i = 0; i < err.errors.length; i++) {
            //console.log(controllerName + "-controller put / err.errors[i].message", err.errors[i].message);
            if (i > 1) {
              errorMessages = errorMessages + ", ";
            };
            errorMessages = errorMessages + err.errors[i].message;
          };

          res.status(500).json({ recordUpdated: false, message: "User not successfully updated.", errorMessages: errorMessages, error: err });
        }
      )
      .catch((err) => {
        console.log(controllerName + "-controller put / err", err);
        res.status(500).json({ recordUpdated: false, message: "User not successfully updated.", error: err });
      });

  } else {
    res.status(200).json({ recordUpdated: false, message: "Please provide a valid email address." });
  };

});


/***************************
 ******* Delete User *******
 ***************************/
// * Allows an admin to hard delete a user
router.delete("/:userID", validateAdmin, (req, res) => {

  const where = { userID: req.params.userID };

  db(tableName)
    .where(where)
    .returning(select)
    .del()
    .then((records) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordDeleted: true, message: "Successfully deleted " + tableName + "." });

      } else {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordDeleted: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;