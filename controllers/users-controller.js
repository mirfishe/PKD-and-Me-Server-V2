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
const { isEmpty, getDateTime, isNonEmptyArray, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const emailRegExp = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

const controllerName = "users";
const tableName = "users";
const select = "*";
const orderBy = [{ column: "lastName", order: "desc" }, { column: "firstName", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


/* ***********************************
 *** User Registration ***************
*********************************** */
router.post("/register", (request, response) => {

  const recordObject = {
    firstName: request.body.recordObject.firstName,
    lastName: request.body.recordObject.lastName,
    email: request.body.recordObject.email,
    password: bcrypt.hashSync(request.body.recordObject.password)
  };

  if (request.body.recordObject.email.match(emailRegExp)) {

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

          response.json({
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
            transactionSuccess: true,
            errorOccurred: false,
            message: `Successfully created ${controllerName}.`,
            sessionToken: token
          });

        },

        createError = (error) => {
          // console.log(componentName, getDateTime(), "post /register createError error", error);
          // console.log(componentName, getDateTime(), "post /register createError error.name", error.name);
          // console.log(componentName, getDateTime(), "post /register createError error.errors[0].message", error.errors[0].message);

          let errorMessages = "";

          if (isNonEmptyArray(error.errors) === true) {

            for (let i = 0; i < error.errors.length; i++) {
              //console.log(componentName, getDateTime(), "post /register createError error.errors[i].message", error.errors[i].message);

              if (i > 1) {

                errorMessages = errorMessages + ", ";

              };

              errorMessages = errorMessages + error.errors[i].message;

            };

          };

          addErrorLog(componentName, "post /register", request.body.recordObject, error);

          response.status(500).json({ transactionSuccess: false, errorOccurred: true, isLoggedIn: false, isAdmin: false, message: `Not successfully registered ${controllerName}.`, errorMessages: errorMessages, error: error });

        })
      .catch((error) => {
        console.error(componentName, getDateTime(), "post /register error", error);

        addErrorLog(componentName, "post /register", request.body.recordObject, error);
        response.status(500).json({ transactionSuccess: false, errorOccurred: true, isLoggedIn: false, isAdmin: false, message: `Not successfully registered ${controllerName}.`, error: error });

      });

  } else {

    response.status(200).json({ transactionSuccess: false, errorOccurred: false, isLoggedIn: false, isAdmin: false, message: "Please provide a valid email address." });

  };

});


/* ***********************************
 *** User Login **********************
*********************************** */
router.post("/login", (request, response) => {

  let email = "";
  let password = "";

  if (isEmpty(request.body.recordObject.email) === false) {

    email = request.body.recordObject.email;

  };

  if (isEmpty(request.body.recordObject.password) === false) {

    password = request.body.recordObject.password;

  };

  const where = { email: email, active: true };

  db.select(select)
    .from(tableName)
    .where(where)
    .then(
      loginSuccess = (records) => {

        records = convertBitTrueFalse(records);

        if (isEmpty(records) === false) {

          bcrypt.compare(password, records[0].password, (error, matches) => {

            if (matches) {

              // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
              // let token = jwt.sign({ userID: records[0].userID }, process.env.JWT_SECRET, { expiresIn: "1d" });
              let token = jwt.sign({ userID: records[0].userID }, jwtSecret, { expiresIn: "1d" });

              response.status(200).json({
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
                transactionSuccess: true,
                errorOccurred: false,
                message: `Successfully authenticated ${controllerName}.`,
                sessionToken: token
              });

            } else {
              // console.log(componentName, getDateTime(), "post /login Login failed. 401");

              addErrorLog(componentName, "post /login Login failed. 401", { user: request.body.recordObject }, null);
              response.status(401).json({ transactionSuccess: true, errorOccurred: false, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: "Login failed." });

            };

          });

        } else {
          // console.log(componentName, getDateTime(), "post /login Failed to authenticate. 401");

          addErrorLog(componentName, "post /login Login failed. 401", { user: request.body.recordObject }, null);
          response.status(401).json({ transactionSuccess: true, errorOccurred: false, isLoggedIn: false, isAdmin: false, message: "Failed to authenticate.", error: "Failed to authenticate." });

        };

      },
      error => {
        console.log(componentName, getDateTime(), "post /login Failed to process. 501 error", error);

        addErrorLog(componentName, "post /login Login failed. 501", { user: request.body.recordObject }, error);
        response.status(501).send({ transactionSuccess: false, errorOccurred: true, isLoggedIn: false, isAdmin: false, message: "Failed to process.", error: "Failed to process." });

      }
    )
    .catch((error) => {
      console.error(componentName, getDateTime(), "post /login error", error);

      addErrorLog(componentName, "post /login 500 error", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, isLoggedIn: false, isAdmin: false, message: "Login failed.", error: error });

    });
});


/******************************
 ***** Get Users *****
 ******************************/
// * Allows an admin to view all the users -- 03/28/2021 MF
router.get("/admin", validateAdmin, (request, response) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), "get /admin records", records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(componentName, getDateTime(), "get /admin No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "get /admin error", error);

      addErrorLog(componentName, "get /admin", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// * Returns User information for the logged in user -- 03/28/2021 MF
router.get("/", validateSession, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = "";

  if (isEmpty(request.user.userID) === false) {

    userID = request.user.userID;

  };

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  const where = { userID: userID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      records = convertBitTrueFalse(records);

      // if (isEmpty(records) === false) {
      if (records != null) {
        // console.log(componentName, getDateTime(), "get / records", records[0]);

        // response.status(200).json({records: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records."});
        response.status(200).json({
          // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
          // user:   records[0],
          userID: records[0].userID,
          firstName: records[0].firstName,
          lastName: records[0].lastName,
          email: records[0].email,
          updatedBy: records[0].updatedBy,
          admin: records[0].admin,
          active: records[0].active,
          transactionSuccess: true,
          errorOccurred: false,
          message: `Successfully retrieved ${controllerName} information.`
        });

      } else {
        // console.log(componentName, getDateTime(), "get / No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "get / error", error);

      addErrorLog(componentName, "get /", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/********************************
 ***** Get User By UserID *******
*******************************/
// Returns User information for the admin -- 03/28/2021 MF
router.get("/:userID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = "";

  if (isEmpty(request.params.userID) === false) {

    userID = request.params.userID;

  };

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  const where = { userID: userID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      records = convertBitTrueFalse(records);

      // if (isEmpty(records) === false) {
      if (records != null) {
        // console.log(componentName, getDateTime(), `get /:${controllerName}ID records`, records[0]);

        // response.status(200).json({records: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records."});
        response.status(200).json({
          // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
          // user:   records[0],
          userID: records[0].userID,
          firstName: records[0].firstName,
          lastName: records[0].lastName,
          email: records[0].email,
          updatedBy: records[0].updatedBy,
          admin: records[0].admin,
          active: records[0].active,
          transactionSuccess: true,
          errorOccurred: false,
          message: `Successfully retrieved ${controllerName} information.`
        });

      } else {
        // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), `get /:${controllerName}ID error`, error);

      addErrorLog(componentName, `get /:${controllerName}ID`, { userID: userID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows an admin to update the user data including soft delete it -- 03/28/2021 MF
// * The admin column is not included here as an extra security feature -- 03/28/2021 MF
router.put("/:userID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = "";

  if (isEmpty(request.params.userID) === false) {

    userID = request.params.userID;

  };

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  const recordObject = {
    firstName: request.body.recordObject.firstName,
    lastName: request.body.recordObject.lastName,
    email: request.body.recordObject.email,
    updatedBy: userID,
    active: request.body.recordObject.active
  };

  // If the user doesn't enter a password, then it isn't updated -- 03/28/2021 MF
  if (request.body.recordObject.password) {

    Object.assign(recordObject, { password: bcrypt.hashSync(request.body.recordObject.password) });

  };

  const where = { userID: userID };

  if (request.body.recordObject.email.match(emailRegExp)) {

    db(tableName)
      .where(where)
      // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
      // .returning(select)
      .update(recordObject)
      // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated. -- 03/28/2021 MF
      .then((records) => {
        // * Returns the number of updated records. -- 08/13/2021 MF

        if (isEmpty(records) === false) {

          response.status(200).json({
            // ? Need to return all the properties of the user to the browser? -- 03/28/2021 MF
            // user:   recordObject,
            userID: recordObject.userID,
            firstName: recordObject.firstName,
            lastName: recordObject.lastName,
            email: recordObject.email,
            updatedBy: recordObject.updatedBy,
            admin: recordObject.admin,
            active: recordObject.active,
            transactionSuccess: true,
            errorOccurred: false,
            message: `Successfully updated${controllerName}.`
          });

        } else {

          response.status(200).json({ primaryKeyID: request.params.userID, transactionSuccess: false, errorOccurred: false, message: `Not successfully updated${tableName}.` });

        };

      })
      .catch((error) => {
        console.error(componentName, getDateTime(), `put /:${controllerName}ID error`, error);
        // console.log(componentName, getDateTime(), `put /:${controllerName}ID error.name`, error.name);
        // console.log(componentName, getDateTime(), `put /:${controllerName}ID error.errors[0].message`, error.errors[0].message);

        let errorMessages = "";

        if (isNonEmptyArray(error.errors) === true) {

          for (let i = 0; i < error.errors.length; i++) {
            //console.log(componentName, getDateTime(), `put /:${controllerName}ID error.errors[i].message`, error.errors[i].message);

            if (i > 1) {

              errorMessages = errorMessages + ", ";

            };

          };

          errorMessages = errorMessages + error.errors[i].message;

        };

        addErrorLog(componentName, `put /:${controllerName}ID`, { userID: request.params.userID, recordObject: request.body.recordObject }, error);
        response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: `Not successfully updated${tableName}.`, errorMessages: errorMessages, error: error });

      });

  } else {

    response.status(200).json({ primaryKeyID: request.params.userID, transactionSuccess: false, errorOccurred: false, message: "Please provide a valid email address." });

  };

});


/***************************
 ******* Update User *******
 ***************************/
// * Allows a user to update their own record including soft delete it -- 03/28/2021 MF
// * The admin column is not included here as an extra security feature -- 03/28/2021 MF
router.put("/", validateSession, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = "";

  if (isEmpty(request.user.userID) === false) {

    userID = request.user.userID;

  };

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  const recordObject = {
    firstName: request.body.recordObject.firstName,
    lastName: request.body.recordObject.lastName,
    email: request.body.recordObject.email,
    updatedBy: userID,
    active: request.body.recordObject.active
  };

  // * If the user doesn't enter a password, then it isn't updated -- 03/28/2021 MF
  if (request.body.recordObject.password) {

    Object.assign(recordObject, { password: bcrypt.hashSync(request.body.recordObject.password) });

  };

  const where = { userID: userID };

  if (request.body.recordObject.email.match(emailRegExp)) {

    db(tableName)
      .where(where)
      // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
      // .returning(select)
      .update(recordObject)
      .then(

        updateSuccess = (records) => {
          // * Returns the number of updated records. -- 08/13/2021 MF

          if (isEmpty(records) === false) {

            // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
            // let token = jwt.sign({userID: recordObject.userID}, process.env.JWT_SECRET, {expiresIn: "1d"});
            response.json({
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
              transactionSuccess: true,
              errorOccurred: false,
              message: `Successfully updated ${controllerName}.`,
              // sessionToken:   token // * User gets a new sessionToken even if they haven't updated their password -- 03/28/2021 MF
            });

          } else {

            response.status(200).json({ primaryKeyID: request.user.userID, transactionSuccess: false, errorOccurred: false, isLoggedIn: true, message: `Successfully updated ${tableName}.` });

          };

        },

        updateError = (error) => {
          console.log(componentName, getDateTime(), "put / error", error);
          // console.log(componentName, getDateTime(), "put / error.name", error.name);
          // console.log(componentName, getDateTime(), "put / error.errors[0].message", error.errors[0].message);

          let errorMessages = "";

          if (isNonEmptyArray(error.errors) === true) {

            for (let i = 0; i < error.errors.length; i++) {
              //console.log(componentName, getDateTime(), "put / error.errors[i].message", error.errors[i].message);

              if (i > 1) {

                errorMessages = errorMessages + ", ";

              };

              errorMessages = errorMessages + error.errors[i].message;

            };

          };

          addErrorLog(componentName, `put /`, request.body.recordObject, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: `Not successfully updated${tableName}.`, errorMessages: errorMessages, error: error });

        }

      )
      .catch((error) => {
        console.error(componentName, getDateTime(), "put / error", error);

        response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

      });

  } else {

    response.status(200).json({ primaryKeyID: request.user.userID, transactionSuccess: false, errorOccurred: false, message: "Please provide a valid email address." });

  };

});


/***************************
 ******* Delete User *******
 ***************************/
// * Allows an admin to hard delete a user -- 03/28/2021 MF
router.delete("/:userID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = "";

  if (isEmpty(request.params.userID) === false) {

    userID = request.params.userID;

  };

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  const where = { userID: userID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(componentName, getDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ primaryKeyID: request.params.userID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {
        // console.log(componentName, getDateTime(), `delete /:${controllerName}ID No Results`);

        response.status(200).json({ primaryKeyID: request.params.userID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(componentName, `delete /:${controllerName}ID`, { userID: userID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;