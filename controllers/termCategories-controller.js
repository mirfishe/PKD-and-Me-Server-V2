"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime, isNonEmptyArray } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");

const controllerName = "termCategories";
const tableName = "termCategories";
const select = "*";
// const orderBy = [{ column: "sortID", order: "asc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Term Categories *********
 ******************************/
router.get("/", (request, response) => {

  db.select(select)
    .from(tableName)
    // .orderBy(orderBy)
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


module.exports = router;