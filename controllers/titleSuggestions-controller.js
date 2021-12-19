"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");

const controllerName = "titleSuggestions";
const tableName = "titleSuggestions";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];


/******************************
 ***** Get Title Suggestions *********
 ******************************/
router.get("/", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

        res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

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


/**************************************
 ***** Get Title Suggestion By titleSuggestionID *****
***************************************/
router.get("/:titleSuggestionID", validateAdmin, (req, res) => {

  const where = { titleSuggestionID: req.params.titleSuggestionID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

        res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${controllerName}.`, records: records });

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


/* ******************************
 *** Add Title Suggestion ***************
*********************************/
router.post("/", /*validateSession,*/(req, res) => {

  const recordObject = {
    // userID: req.user.userID,
    userID: req.body.titleSuggestion.userID,
    email: req.body.titleSuggestion.email,
    titleName: req.body.titleSuggestion.titleName,
    authorFirstName: req.body.titleSuggestion.authorFirstName,
    authorLastName: req.body.titleSuggestion.authorLastName,
    publicationDate: req.body.titleSuggestion.publicationDate,
    shortDescription: req.body.titleSuggestion.shortDescription,
    titleURL: req.body.titleSuggestion.titleURL
    // dateEntered: req.body.recordObject.dateEntered
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
        res.status(200).json({ recordAdded: true, message: `Successfully created ${controllerName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      res.status(500).json({ recordAdded: false, message: `Not successfully created ${controllerName}.`, error: error });

    });

});


module.exports = router;