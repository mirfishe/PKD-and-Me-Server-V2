"use strict";

const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { IsEmpty, GetDateTime } = require("./sharedFunctions");
// const addErrorLog = require("./addErrorLog");

const functionName = "addLog";
const tableName = "logs";
// const select = "*";


const addLog = (controllerName, operation, transactionData) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert({
      operation: operation,
      componentName: controllerName,
      transactionData: transactionData,
      createDate: GetDateTime()
    })
    .then((results) => {
      // console.log(functionName, GetDateTime(), "results", results);

      // databaseVersion = results[0].databaseVersion;

      // if (records.length > 0) {

      //   console.log(functionName, GetDateTime(), "records", records);

      // } else {

      //   console.log(functionName, GetDateTime(), "No Results");

      // };

    })
    .catch((error) => {
      console.error(functionName, GetDateTime(), "error", error);

      // * Removed because was causing an error because of circular dependency. -- 12/23/2021 MF
      // * https://stackoverflow.com/questions/33865068/typeerror-is-not-a-function-in-node-js/53246444 -- 12/23/2021 MF
      // addErrorLog(functionName, tableName, transactionData, error);

    });

};


module.exports = addLog;