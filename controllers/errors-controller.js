"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "errors";
const tableName = "errorLogs";
const select = "*";
const limit = 50;
const orderBy = [{ column: "createDate", order: "desc" }];

let records;


/******************************
 ***** Get Errors *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  // // let sqlQuery = `SELECT TOP (50) * FROM ${tableName} ORDER BY createDate DESC`;
  // // * SQL syntax for MySQL. -- 12/27/2021 MF
  // let sqlQuery = `SELECT * FROM ${tableName} ORDER BY createDate DESC LIMIT 50`;

  // // db.raw(sqlQuery).toSQL();

  // // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

  // db.raw(sqlQuery)
  db.select(select)
    .from(tableName)
    .limit(limit)
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
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // recordObject.errorID = records[0];

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