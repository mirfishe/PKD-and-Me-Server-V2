"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, isNonEmptyArray, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "titleSuggestions";
const tableName = "titleSuggestions";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Title Suggestions *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  db.select(select)
    .from(tableName)
    .leftOuterJoin("users", "users.userID", "titleSuggestions.userID")
    .orderBy(orderBy)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get / error", error);

      addErrorLog(componentName, "get /", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Title Suggestion By titleSuggestionID *****
***************************************/
// router.get("/:titleSuggestionID", validateAdmin, (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleSuggestionID = isEmpty(request.params.titleSuggestionID) === false ? request.params.titleSuggestionID : "";

// if (isNaN(formatTrim(titleSuggestionID)) === true) {

//   titleSuggestionID = 0;

// } else {

//   titleSuggestionID = parseInt(titleSuggestionID);

// };

// const where = { titleSuggestionID: titleSuggestionID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /:titleSuggestionID error", error);

//       addErrorLog(componentName, "get /:titleSuggestionID", {"titleSuggestionID": titleSuggestionID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Title Suggestion ***************
*********************************/
router.post("/", /* validateSession, */(request, response) => {

  // // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  // let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  // if (isNaN(formatTrim(userID)) === true) {

  //   userID = 0;

  // } else {

  //   userID = parseInt(userID);

  // };

  const recordObject = {
    // userID: request.user.userID,
    userID: request.body.recordObject.userID,
    email: request.body.recordObject.email,
    titleName: request.body.recordObject.titleName,
    authorFirstName: request.body.recordObject.authorFirstName,
    authorLastName: request.body.recordObject.authorLastName,
    publicationDate: request.body.recordObject.publicationDate,
    shortDescription: request.body.recordObject.shortDescription,
    titleURL: request.body.recordObject.titleURL
    // dateEntered: request.body.recordObject.dateEntered
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;