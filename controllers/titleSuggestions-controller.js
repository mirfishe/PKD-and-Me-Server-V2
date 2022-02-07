"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "titleSuggestions";
const tableName = "titleSuggestions";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];

let records;


/******************************
 ***** Get Title Suggestions *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  db.select(select)
    .from(tableName)
    .leftOuterJoin("users", "users.userID", "titleSuggestions.userID")
    .orderBy(orderBy)
    .then((records) => {

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get / No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Title Suggestion By titleSuggestionID *****
***************************************/
// router.get("/:titleSuggestionID", validateAdmin, (request, response) => {

//   const where = { titleSuggestionID: request.params.titleSuggestionID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .then((records) => {

//       if (isEmpty(records) === false) {
//         // console.log(`${controllerName}-controller`, getDateTime(), `get /:titleSuggestionID ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, getDateTime(), "get /:titleSuggestionID No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(`${controllerName}-controller`, getDateTime(), "get /:titleSuggestionID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /:titleSuggestionID", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Title Suggestion ***************
*********************************/
router.post("/", /* validateSession, */(request, response) => {

  const recordObject = {
    // userID: request.user.userID,
    userID: request.body.titleSuggestion.userID,
    email: request.body.titleSuggestion.email,
    titleName: request.body.titleSuggestion.titleName,
    authorFirstName: request.body.titleSuggestion.authorFirstName,
    authorLastName: request.body.titleSuggestion.authorLastName,
    publicationDate: request.body.titleSuggestion.publicationDate,
    shortDescription: request.body.titleSuggestion.shortDescription,
    titleURL: request.body.titleSuggestion.titleURL
    // dateEntered: request.body.recordObject.dateEntered
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);
        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;