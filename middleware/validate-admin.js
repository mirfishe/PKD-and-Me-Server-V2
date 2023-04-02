"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime, isNonEmptyArray } = require("../utilities/sharedFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "validateAdmin";
const tableName = "users";
const select = "*";

const componentName = controllerName;


const validateAdmin = (request, response, next) => {

  const token = request.headers.authorization;

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
  // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  jwt.verify(token, jwtSecret, (error, decoded) => {

    if (isEmpty(error) === true && isEmpty(decoded) === false) {

      const where = { userID: decoded.userID, admin: true, active: true };

      db.select(select)
        .from(tableName)
        .where(where)
        .then(records => {

          // if (isEmpty(records) === true) throw {isAdmin: false, message: "Unauthorized."} // "Unauthorized."; // "error";
          if (isEmpty(records) === true) {

            addErrorLog(componentName, "Unauthorized.", { decoded: decoded, token: token }, null);

            return response.status(401).json({ transactionSuccess: false, errorOccurred: false, isAdmin: false, message: "Unauthorized." });

          } else {

            addLog(componentName, "Successful.", { records: records, decoded: decoded, token: token });

            // ? Need to return all the properties of the user? -- 03/28/2021 MF
            // request.user = records[0];
            request.user = { userID: records[0].userID };
            return next();

          };

        })
        .catch(error => next(error));

    } else {

      request.errors = error;

      addErrorLog(componentName, "Unauthorized.", { decoded: decoded, token: token }, null);

      return response.status(401).json({ transactionSuccess: false, errorOccurred: true, isAdmin: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateAdmin;