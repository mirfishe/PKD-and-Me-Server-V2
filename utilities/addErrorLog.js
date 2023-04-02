"use strict";

const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime, isNonEmptyArray } = require("./sharedFunctions");
// const { convertBitTrueFalse } = require("../utilities/applicationFunctions");

const functionName = "addErrorLog";
const tableName = "errorLogs";
// const select = "*";

const componentName = functionName;

const addErrorLog = (controllerName, operation, transactionData, errorData) => {

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert({
      operation: operation,
      componentName: controllerName,
      transactionData: JSON.stringify(transactionData),
      errorData: JSON.stringify(errorData),
      createDate: getDateTime()
    })
    .then((results) => {

      // records = convertBitTrueFalse(results);
      // records = results;

      // if (isEmpty(records) === false) {

      //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      // } else {

      //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      // };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

};


module.exports = addErrorLog;