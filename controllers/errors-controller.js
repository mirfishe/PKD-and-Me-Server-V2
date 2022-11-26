"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "errors";
const tableName = "errorLogs";
const select = "*";
const limit = 50;
const orderBy = [{ column: "createDate", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Errors *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  // // let sqlQuery = `SELECT TOP (50) * FROM ${tableName} ORDER BY createDate DESC`;
  // // * SQL syntax for MySQL. -- 12/27/2021 MF
  // let sqlQuery = `SELECT * FROM ${tableName} ORDER BY createDate DESC LIMIT 50`;

  // // db.raw(sqlQuery).toSQL();

  // // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

  // db.raw(sqlQuery)
  db.select(select)
    .from(tableName)
    .limit(limit)
    .orderBy(orderBy)
    .then((records) => {

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


/* ******************************
 *** Add Error ***************
*********************************/
router.post("/", (request, response) => {

  const recordObject = {
    operation: request.body.recordObject.operation,
    componentName: request.body.recordObject.componentName,
    transactionData: JSON.stringify(request.body.recordObject.transactionData),
    errorData: JSON.stringify(request.body.recordObject.errorData),
    createDate: request.body.recordObject.createDate
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(componentName, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), "post / records", records);
        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(componentName, getDateTime(), "post / No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "post / error", error);

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;