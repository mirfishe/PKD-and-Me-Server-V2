"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime, convertBitTrueFalse } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "categories";
const tableName = "categories";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];

let records;


/******************************
 ***** Get Categories *********
 ******************************/
// * Returns all categories active or not -- 03/28/2021 MF
// router.get("/list", (request, response) => {
router.get("/", (request, response) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "", GetDateTime(), `get / ${tableName}`, records);

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


/******************************
 ***** Get Categories *********
 ******************************/
// * Only returns categories that have titles linked to them -- 03/28/2021 MF
// * Need to return all categories that are active for the add title function -- 03/28/2021 MF
// router.get("/", (request, response) => {

//   const where = { active: true };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);

//       addErrorLog(`${controllerName}-controller`, "get /", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


module.exports = router;