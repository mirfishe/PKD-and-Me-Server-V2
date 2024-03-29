"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, isNonEmptyArray } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "computerLogs";
const tableName = "computerLogs";
const select = "*";
const limit = 50;
const orderBy = [{ column: "timestamp", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Computer Logs *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  // // let sqlQuery = `SELECT TOP (50) * FROM ${tableName} ORDER BY createDate DESC`;
  // // * SQL syntax for MySQL. -- 12/27/2021 MF
  // let sqlQuery = `SELECT * FROM ${tableName} ORDER BY createDate DESC LIMIT 50`;

  // // db.raw(sqlQuery).toSQL();

  // db.raw(sqlQuery)
  db.select(select)
    .from(tableName)
    .limit(limit)
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


/******************************
 ***** Get Broken Links *********
 ******************************/
router.get("/broken", validateAdmin, (request, response) => {

  db.select(select)
    .from("brokenLinks")
    .limit(limit)
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

      console.error(componentName, getDateTime(), "get /broken error", error);

      addErrorLog(componentName, "get /broken", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/***************************
 *** Add Computer Log *******
 ***************************/
router.post("/", (request, response) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert({

      title: request.body.recordObject.title,
      href: request.body.recordObject.href,
      applicationVersion: request.body.recordObject.applicationVersion,

      ipAddress: request.body.recordObject.ipAddress,
      lastAccessed: request.body.recordObject.lastAccessed,

      city: request.body.recordObject.city,
      state: request.body.recordObject.state,
      countryCode: request.body.recordObject.countryCode,
      countryName: request.body.recordObject.countryName,

      // * Additional information from https://geolocation-db.com/json/ -- 07/19/2021 MF
      latitude: request.body.recordObject.latitude,
      longitude: request.body.recordObject.longitude,
      postal: request.body.recordObject.postal,

      // * Additional information from https://api.db-ip.com/v2/free/self -- 07/19/2021 MF
      continentCode: request.body.recordObject.continentCode,
      continentName: request.body.recordObject.continentName,
      stateCode: request.body.recordObject.stateCode

    })
    .then((results) => {

      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;