"use strict";

const router = require("express").Router();
// const databaseConfig = require("../database");
// const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
// const addLog = require("../utilities/addLog");
// const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "test";
// const tableName = "test";
// const select = "*";
// const orderBy = [{ column: "lastAccessed", order: "desc" }];

let records;


// /******************************
//  ***** Get Test *********
//  ******************************/
router.get("/", (request, response) => {

  console.log(`${controllerName}s-controller`, getDateTime(), "get /", "Test succeeded.");

  // addLog(databaseName, `${controllerName} succeeded.`, null);

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Test succeeded." });

});


// /******************************
//  ***** Get Insert Line In Log Files *********
//  ******************************/
router.get("/addline", (request, response) => {

  console.log(`${controllerName}s-controller`, getDateTime(), "get /addline");
  console.log("######################################################################################################");

  console.error(`${controllerName}s-controller`, getDateTime(), "get /addline");
  console.error("######################################################################################################");

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Add line succeeded." });

});


module.exports = router;