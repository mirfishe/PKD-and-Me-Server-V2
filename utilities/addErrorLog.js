"use strict";

const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { IsEmpty, GetDateTime } = require("./sharedFunctions");

const functionName = "addErrorLog";
const tableName = "errorLogs";
// const select = "*";

const addErrorLog = (controllerName, operation, transactionData, errorData) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert({
      operation: operation,
      componentName: controllerName,
      transactionData: JSON.stringify(transactionData),
      errorData: JSON.stringify(errorData),
      createDate: GetDateTime()
    })
    .then((records) => {
      // console.log(functionName, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // recordObject.errorID = records[0];

      // if (records > 0) {
      //   // console.log(functionName, GetDateTime(), "post / records", records);
      //   response.status(200).json({ recordAdded: true, message: `Successfully created ${functionName}.`, records: [recordObject] });

      // } else {
      //   // console.log(functionName, GetDateTime(), "post / No Results");

      //   // response.status(200).send("No records found.");
      //   // response.status(200).send({resultsFound: false, message: "No records found."})
      //   response.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      // };

    })
    .catch((error) => {
      console.error(functionName, GetDateTime(), "post / error", error);

      // response.status(500).json({ recordAdded: false, message: `Not successfully created ${functionName}.`, error: error });

    });

};


module.exports = addErrorLog;