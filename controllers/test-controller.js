"use strict";

const router = require("express").Router();
const operatingSystem = require("os");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
// const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");

const controllerName = "test";
// const tableName = "test";
const tableName = "categories";
const databaseName = "pkd-and-me";
const select = "*";
// const testWhere = { "applicationSettingsID": 2 };
// const orderBy = [{ column: "lastAccessed", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


// /******************************
//  ***** Get Test *********
//  ******************************/
router.get("/", (request, response) => {

  console.log(componentName, getDateTime(), "get /", "Test succeeded.");

  // addLog(databaseName, `${componentName} succeeded.`, {});

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Test succeeded." });

});


// /******************************
//  ***** Get Insert Line In Log Files *********
//  ******************************/
router.get("/addline", (request, response) => {

  console.log(componentName, getDateTime(), "get /addline");
  console.log("######################################################################################################");

  console.error(componentName, getDateTime(), "get /addline");
  console.error("######################################################################################################");

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Add line succeeded." });

});



// /******************************
//  ***** Get Health Check *********
//  ******************************/
router.get("/health", (request, response) => {

  let healthcheck = {
    hostname: operatingSystem.hostname(),
    networkInterfaces: operatingSystem.networkInterfaces(),
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now()
  };

  db.select(select)
    .from(tableName)
    // .orderBy(orderBy)
    .then((records) => {
      // console.log(`${componentName}`, getDateTime(), "/health records", records);

      records = records;

      // addLog(databaseName, `${componentName} Get ${tableName}`, { databaseVersion: databaseVersion });

      if (isEmpty(records) === false && records.length > 0) {

        healthcheck.databaseRecords = records.length;

        records = healthcheck;

        addLog(databaseName, `${componentName} Get Health Check`, {});

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${componentName}`, getDateTime(), "/health No Results");

        healthcheck.databaseRecords = 0;
        healthcheck.message = "Internal Server Error";

        records = healthcheck;

        // addLog(databaseName, `${componentName}`, {});
        addErrorLog(databaseName, `${componentName}`, "/health", {}, "No records found.", false, false);

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found.", records });

      };

    })
    .catch((error) => {
      console.error(`${componentName}`, getDateTime(), "/health error", error);

      healthcheck.databaseRecords = 0;
      healthcheck.message = "Internal Server Error";

      records = healthcheck;

      addErrorLog(databaseName, `${componentName}`, "/health", {}, error, false, false);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found.", records, error });

    });

});


module.exports = router;