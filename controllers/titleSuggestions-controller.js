"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
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
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

        response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

        // response.status(200).send(`No ${tableName} found.`);
        // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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

//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:titleSuggestionID ${tableName}`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${controllerName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /:titleSuggestionID No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /:titleSuggestionID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /:titleSuggestionID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      recordObject.titleSuggestionID = records[0];

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
        response.status(200).json({ recordAdded: true, message: `Successfully created ${controllerName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / No Results");

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ recordAdded: false, message: `Not successfully created ${controllerName}.`, error: error });

    });

});


module.exports = router;