"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "comments";
const tableName = "comments";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];

let records;


/******************************
 ***** Get Comments *********
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
      console.error(`${controllerName}-controller`, GetDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

    });

});


/**************************************
 ***** Get Comment By commentID *****
***************************************/
// router.get("/:commentID", validateAdmin, (request, response) => {

//   const where = { commentID: request.params.commentID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .then((records) => {

//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:commentID ${tableName}`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${controllerName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /:commentID No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.error(`${controllerName}-controller`, GetDateTime(), "get /:commentID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /:commentID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/* ******************************
 *** Add Comment ***************
*********************************/
router.post("/", /* validateSession, */(request, response) => {

  const recordObject = {
    // userID: request.user.userID,
    userID: request.body.comment.userID,
    email: request.body.comment.email,
    comment: request.body.comment.comment
    // dateEntered: request.body.recordObject.dateEntered
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF -- 08/13/2021 MF

      recordObject.commentID = records[0];

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
      console.error(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ recordAdded: false, message: `Not successfully created ${controllerName}.`, error: error });

    });

});


module.exports = router;