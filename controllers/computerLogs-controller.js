"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "computerLogs";
const tableName = "computerLogs";
const select = "*";
const orderBy = [{ column: "timestamp", order: "desc" }];

let records;


/******************************
 ***** Get Computer Logs *********
 ******************************/
router.get("/", (request, response) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((results) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "get / results", results);

      records = results;

      // console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records);

      if (records.length > 0) {

        // console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records);
        response.status(200).json({ resultsFound: true, message: "Successfully retrieved records.", records: records });

      } else {

        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");
        response.status(200).json({ resultsFound: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, GetDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ resultsFound: true, message: "No records found." });

    });

});


/******************************
 ***** Get Broken Links *********
 ******************************/
router.get("/broken", (request, response) => {

  db.select(select)
    .from("brokenLinks")
    .orderBy([{ column: "timestamp", order: "desc" }])
    .then((results) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "get /broken results", results);

      records = results;

      // console.log(`${controllerName}-controller`, GetDateTime(), "get /broken records", records);

      if (records.length > 0) {

        // console.log(`${controllerName}-controller`, GetDateTime(), "get /broken records", records);
        response.status(200).json({ resultsFound: true, message: "Successfully retrieved records.", records: records });

      } else {

        // console.log(`${controllerName}-controller`, GetDateTime(), "get /broken No Results");
        response.status(200).json({ resultsFound: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, GetDateTime(), "get /broken error", error);

      addErrorLog(`${controllerName}-controller`, "get /broken", records, error);
      response.status(500).json({ resultsFound: true, message: "No records found." });

    });

});


/***************************
 *** Add Computer Log *******
 ***************************/
// * Enters a log entry from the data posted. -- 08/13/2021 MF
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
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / results", results);

      records = results;

      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);

      if (records.length > 0) {

        // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        // console.log(`${controllerName}-controller`, GetDateTime(), "post / No Results");
        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;