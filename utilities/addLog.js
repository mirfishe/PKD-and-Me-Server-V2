"use strict";

const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime } = require("./sharedFunctions");
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
      createDate: getDateTime()
    })
    .then((results) => {
      // console.log(functionName, getDateTime(), "results", results);

      // if (isEmpty(records) === false) {

      //   console.log(functionName, getDateTime(), "records", records);

      // } else {

      //   console.log(functionName, getDateTime(), "No Results");

      // };

    })
    .catch((error) => {
      console.error(functionName, getDateTime(), "error", error);

      // * Removed because was causing an error because of circular dependency. -- 12/23/2021 MF
      // * https://stackoverflow.com/questions/33865068/typeerror-is-not-a-function-in-node-js/53246444 -- 12/23/2021 MF
      // addErrorLog(functionName, tableName, transactionData, error);

    });

};


module.exports = addLog;