"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "categories";
const tableName = "categories";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];

const componentName = `${controllerName}-controller`;

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

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `get / ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

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

//       if (isEmpty(records) === false) {
//         console.log(componentName, getDateTime(), `get / ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(componentName, getDateTime(), "get / No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), "get / error", error);

//       addErrorLog(componentName, "get /", {}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


module.exports = router;