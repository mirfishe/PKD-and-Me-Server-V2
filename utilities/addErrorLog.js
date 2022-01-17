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

      // if (IsEmpty(records) === false) {
      //   // console.log(functionName, GetDateTime(), "post / records", records);
      //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      // } else {
      //   // console.log(functionName, GetDateTime(), "post / No Results");

      //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      // };

    })
    .catch((error) => {
      console.error(functionName, GetDateTime(), "post / error", error);

      // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

};


module.exports = addErrorLog;