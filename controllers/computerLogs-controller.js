"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");

const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");

const controllerName = "computerLog";
const tableName = "computerLogs";
const select = "*";
const orderBy = [{ column: "lastAccessed", order: "desc" }];

let records;


/******************************
 ***** Get Computer Logs *********
 ******************************/
router.get("/", (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((results) => {
      // console.log(`${controllerName}s-controller`, GetDateTime(), "get / results", results);

      records = results;

      // console.log(`${controllerName}s-controller`, GetDateTime(), "get / records", records);

      if (records.length > 0) {

        // console.log(`${controllerName}s-controller`, GetDateTime(), "get / records", records);
        res.status(200).json({ resultsFound: true, message: "Successfully retrieved records.", records: records });

      } else {

        // console.log(`${controllerName}s-controller`, GetDateTime(), "get / No Results");
        res.status(200).json({ resultsFound: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}s-controller`, GetDateTime(), "get / error", error);

      res.status(500).json({ resultsFound: true, message: "No records found." });

    });

});


/***************************
 *** Add Computer Log *******
 ***************************/
// * Enters a log entry from the data posted. -- 08/13/2021 MF
router.post("/", (req, res) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert({

      title: req.body.recordObject.title,
      href: req.body.recordObject.href,
      applicationVersion: req.body.recordObject.applicationVersion,

      ipAddress: req.body.recordObject.ipAddress,
      lastAccessed: req.body.recordObject.lastAccessed,

      city: req.body.recordObject.city,
      state: req.body.recordObject.state,
      countryCode: req.body.recordObject.countryCode,
      countryName: req.body.recordObject.countryName,

      // * Additional information from https://geolocation-db.com/json/ -- 07/19/2021 MF
      latitude: req.body.recordObject.latitude,
      longitude: req.body.recordObject.longitude,
      postal: req.body.recordObject.postal,

      // * Additional information from https://api.db-ip.com/v2/free/self -- 07/19/2021 MF
      continentCode: req.body.recordObject.continentCode,
      continentName: req.body.recordObject.continentName,
      stateCode: req.body.recordObject.stateCode

    })
    .then((results) => {
      // console.log(`${controllerName}s-controller`, GetDateTime(), "post / results", results);

      records = results;

      // console.log(`${controllerName}s-controller`, GetDateTime(), "post / records", records);

      if (records.length > 0) {

        // console.log(`${controllerName}s-controller`, GetDateTime(), "post / records", records);
        res.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        // console.log(`${controllerName}s-controller`, GetDateTime(), "post / No Results");
        res.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}s-controller`, GetDateTime(), "post / error", error);

      res.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;