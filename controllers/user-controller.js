const router = require("express").Router();
const User = require("../db").import("../models/user");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const emailRegExp = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

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
            message: "User successfully created.",
            sessionToken: token
          });
        },
        createError = (err) => {
          // console.log("user-controller post /register createError err", err);
          // console.log("user-controller post /register createError err.name", err.name);
          // console.log("user-controller post /register createError err.errors[0].message", err.errors[0].message);

          let errorMessages = "";
          for (let i = 0; i < err.errors.length; i++) {
            //console.log("user-controller post /register createError err.errors[i].message", err.errors[i].message);
            if (i > 1) {
              errorMessages = errorMessages + ", ";
            };
            errorMessages = errorMessages + err.errors[i].message;
          };

          res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "User not successfully registered.", errorMessages: errorMessages, error: err });
        })
      .catch(err => {
        console.log("user-controller post /register err", err);
        res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "User not successfully registered.", error: err });
      })

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
              console.log("user-controller post /login Login failed. 401");
              res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: "Login failed." });
            };
          })
        } else {
          // console.log("user-controller post /login Failed to authenticate. 401");
          res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to authenticate.", error: "Failed to authenticate." });
        };
      },
      err => {
        console.log("user-controller post /login Failed to process. 501 err", err);
        res.status(501).send({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to process.", error: "Failed to process." })
      }
    )
    .catch(err => {
      console.log("user-controller post /login err", err);
      res.status(500).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: err });
    })
});

/******************************
 ***** Get Users *****
 ******************************/
// * Allows an admin to view all the users
router.get("/admin", validateAdmin, (req, res) => {

  // const query = {include: {all: true, nested: true}, order: [["lastName", "DESC"], ["firstName", "DESC"]]};
  const query = { order: [["lastName", "DESC"], ["firstName", "DESC"]] };

  User.findAll(query)
    .then((users) => {
      if (users.length > 0) {
        // console.log("user-controller get /admin users", users);
        res.status(200).json({ users: users, resultsFound: true, message: "Successfully retrieved users." });
      } else {
        // console.log("user-controller get /admin No Results");
        // res.status(200).send("No users found.");
        // res.status(200).send({resultsFound: false, message: "No users found."})
        res.status(200).json({ resultsFound: false, message: "No users found." });
      };
    })
    .catch((err) => {
      console.log("user-controller get /admin err", err);
      res.status(500).json({ resultsFound: false, message: "No users found.", error: err });
    });

});

/********************************
 ***** Get User By UserID *******
*******************************/
// * Returns User information for the logged in user
router.get("/", validateSession, (req, res) => {

  const query = {
    where: {
      userID: { [Op.eq]: req.user.userID }
      // }, include: {all: true, nested: true}};
    }
  };

  User.findOne(query)
    // User.findAll(query)
    .then((user) => {
      // if (user.length > 0) {
      if (user != null) {
        // console.log("user-controller get / user", user);
        // res.status(200).json({users: users, resultsFound: true, message: "Successfully retrieved user."});
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
        // console.log("user-controller get / No Results");
        // res.status(200).send("No users found.");
        // res.status(200).send({resultsFound: false, message: "No users found."})
        res.status(200).json({ resultsFound: false, message: "No users found." });
      };
    })
    .catch((err) => {
      console.log("user-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No users found.", error: err });
    });

});

/********************************
 ***** Get User By UserID *******
*******************************/
// Returns User information for the admin
router.get("/:userID", validateAdmin, (req, res) => {

  const query = {
    where: {
      userID: { [Op.eq]: req.params.userID }
      // }, include: {all: true, nested: true}};
    }
  };

  User.findOne(query)
    // User.findAll(query)
    .then((user) => {
      // if (user.length > 0) {
      if (user != null) {
        // console.log("user-controller get /:userID user", user);
        // res.status(200).json({users: users, resultsFound: true, message: "Successfully retrieved user."});
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
        // console.log("user-controller get /:userID No Results");
        // res.status(200).send("No users found.");
        // res.status(200).send({resultsFound: false, message: "No users found."})
        res.status(200).json({ resultsFound: false, message: "No users found." });
      };
    })
    .catch((err) => {
      console.log("user-controller get /:userID err", err);
      res.status(500).json({ resultsFound: false, message: "No users found.", error: err });
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
        console.log("user-controller put /:userID err", err);
        // console.log("user-controller put /:userID err.name", err.name);
        // console.log("user-controller put /:userID err.errors[0].message", err.errors[0].message);

        let errorMessages = "";
        for (let i = 0; i < err.errors.length; i++) {
          //console.log("user-controller put /:userID err.errors[i].message", err.errors[i].message);
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
          console.log("user-controller put / err", err);
          // console.log("user-controller put / err.name", err.name);
          // console.log("user-controller put / err.errors[0].message", err.errors[0].message);

          let errorMessages = "";
          for (let i = 0; i < err.errors.length; i++) {
            //console.log("user-controller put / err.errors[i].message", err.errors[i].message);
            if (i > 1) {
              errorMessages = errorMessages + ", ";
            };
            errorMessages = errorMessages + err.errors[i].message;
          };

          res.status(500).json({ recordUpdated: false, message: "User not successfully updated.", errorMessages: errorMessages, error: err });
        }
      )
      .catch((err) => {
        console.log("user-controller put / err", err);
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

  const query = {
    where: {
      userID: { [Op.eq]: req.params.userID }
    }
  };

  User.destroy(query)
    .then(() => res.status(200).json({ recordDeleted: true, message: "User successfully deleted." }))
    .catch((err) => {
      console.log("user-controller delete /:userID err", err);
      res.status(500).json({ recordDeleted: false, message: "User not successfully deleted.", error: err });
    });

});

module.exports = router;