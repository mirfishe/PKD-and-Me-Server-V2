// * Uncommenting "use strict"; causes an error in this controller. -- 11/14/2021 MF
// "use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

// const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const emailRegExp = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const controllerName = "users";
const tableName = "users";
const select = "*";
const orderBy = [{ column: "lastName", order: "desc" }, { column: "firstName", order: "desc" }];


// TODO: Fix all the user administration routes below. They assume that no records are returned after the add, update or delete. -- 08/13/2021 MF



/* ***********************************
 *** User Registration ***************
*********************************** */
router.post("/register", (req, res) => {

  const recordObject = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password)
  };

  if (req.body.user.email.match(emailRegExp)) {

    db(tableName)
      // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
      // .returning(select)
      .insert(recordObject)
      .then(

        createSuccess = (records) => {
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          recordObject.userID = records[0];

          // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
          // let token = jwt.sign({ userID: recordObject.userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
          let token = jwt.sign({ userID: recordObject.userID }, jwtSecret, { expiresIn: "1d" });

          res.json({
            // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
            // user:   recordObject,
            userID: recordObject.userID,
            firstName: recordObject.firstName,
            lastName: recordObject.lastName,
            email: recordObject.email,
            updatedBy: recordObject.updatedBy,
            admin: recordObject.admin,
            active: recordObject.active,
            isLoggedIn: true,
            isAdmin: recordObject.admin,
            recordAdded: true,
            message: `Successfully created ${controllerName}.`,
            sessionToken: token
          });

        },

        createError = (error) => {
          // console.log(`${controllerName}-controller`, GetDateTime(), "post /register createError error", error);
          // console.log(`${controllerName}-controller`, GetDateTime(), "post /register createError error.name", error.name);
          // console.log(`${controllerName}-controller`, GetDateTime(), "post /register createError error.errors[0].message", error.errors[0].message);

          let errorMessages = "";

          for (let i = 0; i < error.errors.length; i++) {
            //console.log(`${controllerName}-controller`, GetDateTime(), "post /register createError error.errors[i].message", error.errors[i].message);

            if (i > 1) {

              errorMessages = errorMessages + ", ";

            };

            errorMessages = errorMessages + error.errors[i].message;

          };

          res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: `Not successfully registered ${controllerName}.`, errorMessages: errorMessages, error: error });

        })
      .catch((error) => {

        console.log(`${controllerName}-controller`, GetDateTime(), "post /register error", error);
        res.status(500).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: `Not successfully registered ${controllerName}.`, error: error });

      });

  } else {

    res.status(200).json({ recordAdded: false, isLoggedIn: false, isAdmin: false, message: "Please provide a valid email address." });

  };

});


/* ***********************************
 *** User Login **********************
*********************************** */
router.post("/login", (req, res) => {

  const where = { email: req.body.user.email, active: true };

  db.select(select)
    .from(tableName)
    .where(where)
    .then(
      loginSuccess = (records) => {

        records = convertBitTrueFalse(records);

        if (records.length > 0) {

          bcrypt.compare(req.body.user.password, records[0].password, (error, matches) => {

            if (matches) {

              // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
              // let token = jwt.sign({ userID: records[0].userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
              let token = jwt.sign({ userID: records[0].userID }, jwtSecret, { expiresIn: "1d" });

              res.status(200).json({
                // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
                // user:   records[0],
                userID: records[0].userID,
                firstName: records[0].firstName,
                lastName: records[0].lastName,
                email: records[0].email,
                updatedBy: records[0].updatedBy,
                admin: records[0].admin,
                active: records[0].active,
                isLoggedIn: true,
                isAdmin: records[0].admin,
                resultsFound: true,
                message: `Successfully authenticated ${controllerName}.`,
                sessionToken: token
              });

            } else {

              console.log(`${controllerName}-controller`, GetDateTime(), "post /login Login failed. 401");
              res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: "Login failed." });

            };

          });

        } else {

          // console.log(`${controllerName}-controller`, GetDateTime(), "post /login Failed to authenticate. 401");
          res.status(401).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to authenticate.", error: "Failed to authenticate." });

        };

      },
      error => {

        console.log(`${controllerName}-controller`, GetDateTime(), "post /login Failed to process. 501 error", error);
        res.status(501).send({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Failed to process.", error: "Failed to process." });

      }
    )
    .catch((error) => {

      console.log(`${controllerName}-controller`, GetDateTime(), "post /login error", error);
      res.status(500).json({ resultsFound: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: error });

    });
});


/******************************
 ***** Get Users *****
 ******************************/
// * Allows an admin to view all the users -- 03/28/2021 MF
router.get("/admin", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get /admin records", records);

        res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get /admin No Results");

        // res.status(200).send(`No ${tableName} found.`);
        // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get /admin error", error);
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });
    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// * Returns User information for the logged in user -- 03/28/2021 MF
router.get("/", validateSession, (req, res) => {

  const where = { userID: req.user.userID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      records = convertBitTrueFalse(records);

      // if (records.length > 0) {
      if (records != null) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records[0]);

        // res.status(200).json({records: records[0], resultsFound: true, message: `Successfully retrieved ${tableName}.`});
        res.status(200).json({
          // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
          // user:   records[0],
          userID: records[0].userID,
          firstName: records[0].firstName,
          lastName: records[0].lastName,
          email: records[0].email,
          updatedBy: records[0].updatedBy,
          admin: records[0].admin,
          active: records[0].active,
          resultsFound: true,
          message: `Successfully retrieved ${controllerName} information.`
        });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

        // res.status(200).send(`No ${tableName} found.`);
        // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });
    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// Returns User information for the admin -- 03/28/2021 MF
router.get("/:userID", validateAdmin, (req, res) => {

  const where = { userID: req.params.userID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      records = convertBitTrueFalse(records);

      // if (records.length > 0) {
      if (records != null) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID records`, records[0]);

        // res.status(200).json({records: records[0], resultsFound: true, message: `Successfully retrieved ${tableName}.`});
        res.status(200).json({
          // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
          // user:   records[0],
          userID: records[0].userID,
          firstName: records[0].firstName,
          lastName: records[0].lastName,
          email: records[0].email,
          updatedBy: records[0].updatedBy,
          admin: records[0].admin,
          active: records[0].active,
          resultsFound: true,
          message: `Successfully retrieved ${controllerName} information.`
        });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

        // res.status(200).send(`No ${tableName} found.`);
        // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID error`, error);
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });
    });

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows an admin to update the user data including soft delete it -- 03/28/2021 MF
// * The admin column is not included here as an extra security feature -- 03/28/2021 MF
router.put("/:userID", validateAdmin, (req, res) => {

  const recordObject = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    updatedBy: req.user.userID,
    active: req.body.user.active
  };

  // If the user doesn't enter a password, then it isn't updated -- 03/28/2021 MF
  if (req.body.user.password) {

    Object.assign(recordObject, { password: bcrypt.hashSync(req.body.user.password) });

  };

  const where = { userID: req.params.userID };

  if (req.body.user.email.match(emailRegExp)) {

    db(tableName)
      .where(where)
      // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
      // .returning(select)
      .update(recordObject)
      // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated. -- 03/28/2021 MF
      .then((records) => {
        // * Returns the number of updated records. -- 08/13/2021 MF

        if (records > 0) {

          res.status(200).json({
            // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
            // user:   recordObject,
            userID: recordObject.userID,
            firstName: recordObject.firstName,
            lastName: recordObject.lastName,
            email: recordObject.email,
            updatedBy: recordObject.updatedBy,
            admin: recordObject.admin,
            active: recordObject.active,
            recordUpdated: true,
            message: `Successfully updated${controllerName}.`
          });

        } else {

          res.status(200).json({ recordUpdated: false, message: `Not successfully updated${tableName}.` });

        };

      })
      .catch((error) => {
        console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error`, error);
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error.name`, error.name);
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error.errors[0].message`, error.errors[0].message);

        let errorMessages = "";

        for (let i = 0; i < error.errors.length; i++) {
          //console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error.errors[i].message`, error.errors[i].message);

          if (i > 1) {

            errorMessages = errorMessages + ", ";

          };

          errorMessages = errorMessages + error.errors[i].message;

        };

        res.status(500).json({ recordUpdated: false, message: `Not successfully updated${tableName}.`, errorMessages: errorMessages, error: error });

      });

  } else {

    res.status(200).json({ recordUpdated: false, message: "Please provide a valid email address." });

  };

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows a user to update their own record including soft delete it -- 03/28/2021 MF
// * The admin column is not included here as an extra security feature -- 03/28/2021 MF
router.put("/", validateSession, (req, res) => {

  const recordObject = {
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    email: req.body.user.email,
    updatedBy: req.user.userID,
    active: req.body.user.active
  };

  // * If the user doesn't enter a password, then it isn't updated -- 03/28/2021 MF
  if (req.body.user.password) {

    Object.assign(recordObject, { password: bcrypt.hashSync(req.body.user.password) });

  };

  const where = { userID: req.user.userID };

  if (req.body.user.email.match(emailRegExp)) {

    db(tableName)
      .where(where)
      // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
      // .returning(select)
      .update(recordObject)
      .then(

        updateSuccess = (records) => {
          // * Returns the number of updated records. -- 08/13/2021 MF

          if (records > 0) {

            // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
            // let token = jwt.sign({userID: recordObject.userID}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.json({
              // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
              // user:   recordObject,
              userID: recordObject.userID,
              firstName: recordObject.firstName,
              lastName: recordObject.lastName,
              email: recordObject.email,
              updatedBy: recordObject.updatedBy,
              admin: recordObject.admin,
              active: recordObject.active,
              isLoggedIn: true,
              recordUpdated: true,
              message: `Successfully updated ${controllerName}.`,
              // sessionToken:   token // * User gets a new sessionToken even if they haven't updated their password -- 03/28/2021 MF
            });

          } else {

            res.status(200).json({ recordUpdated: false, isLoggedIn: true, message: `Successfully updated ${tableName}.` });

          };

        },

        updateError = (error) => {
          console.log(`${controllerName}-controller`, GetDateTime(), "put / error", error);
          // console.log(`${controllerName}-controller`, GetDateTime(), "put / error.name", error.name);
          // console.log(`${controllerName}-controller`, GetDateTime(), "put / error.errors[0].message", error.errors[0].message);

          let errorMessages = "";

          for (let i = 0; i < error.errors.length; i++) {
            //console.log(`${controllerName}-controller`, GetDateTime(), "put / error.errors[i].message", error.errors[i].message);

            if (i > 1) {

              errorMessages = errorMessages + ", ";

            };

            errorMessages = errorMessages + error.errors[i].message;

          };

          res.status(500).json({ recordUpdated: false, message: `Not successfully updated${tableName}.`, errorMessages: errorMessages, error: error });

        }

      )
      .catch((error) => {
        console.log(`${controllerName}-controller`, GetDateTime(), "put / error", error);
        res.status(500).json({ recordUpdated: false, message: `Not successfully updated${tableName}.`, error: error });
      });

  } else {

    res.status(200).json({ recordUpdated: false, message: "Please provide a valid email address." });

  };

});


/***************************
 ******* Delete User *******
 ***************************/
// * Allows an admin to hard delete a user -- 03/28/2021 MF
router.delete("/:userID", validateAdmin, (req, res) => {

  const where = { userID: req.params.userID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);

        res.status(200).json({ recordDeleted: true, message: `Successfully deleted ${tableName}.`, userID: req.params.userID });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID No Results`);

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordDeleted: false, message: "Nothing to delete.", userID: req.params.userID });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID error`, error);
      res.status(500).json({ recordDeleted: false, message: `Not successfully deleted ${tableName}.`, error: error });
    });

});


module.exports = router;