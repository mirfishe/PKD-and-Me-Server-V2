"use strict";

const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime } = require("./sharedFunctions");
// const addErrorLog = require("./addErrorLog");

const functionName = "addLog";
const tableName = "logs";
// const select = "*";

const componentName = functionName;


const addLog = (controllerName, operation, transactionData) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert({
      operation: operation,
      componentName: controllerName,
      transactionData: JSON.stringify(transactionData),
      createDate: getDateTime()
    })
    .then((results) => {

      // if (isEmpty(records) === false) {

      //   console.log(componentName, getDateTime(), "records", records);

      // } else {

      //   console.log(componentName, getDateTime(), "No Results");

      // };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "error", error);

      // * Removed because was causing an error because of circular dependency. -- 12/23/2021 MF
      // * https://stackoverflow.com/questions/33865068/typeerror-is-not-a-function-in-node-js/53246444 -- 12/23/2021 MF
      // addErrorLog(componentName, tableName, transactionData, error);

    });

};


module.exports = addLog;