"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "validateSession";
const tableName = "users";
const select = "*";


const validateSession = (request, response, next) => {

  const token = request.headers.authorization;

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
  // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  jwt.verify(token, jwtSecret, (error, decoded) => {
    // console.log(controllerName, getDateTime(), "token", token);
    // console.log(controllerName, getDateTime(), "decoded", decoded);
    // console.log(controllerName, getDateTime(), "error", error);

    if (isEmpty(error) === true && isEmpty(decoded) === false) {

      const where = { userID: decoded.userID, active: true };

      db.select(select)
        .from(tableName)
        .where(where)
        .then(records => {
          // console.log(controllerName, getDateTime(), "records", records);

          // if (isEmpty(records) === true) throw "Unauthorized."; // "error";
          if (isEmpty(records) === true) {

            addErrorLog(`${controllerName}-controller`, "Unauthorized.", JSON.stringify({ decoded: decoded, token: token }), null);

            return response.status(401).json({ transactionSuccess: false, errorOccurred: false, isLoggedIn: false, message: "Unauthorized." });

          } else {

            addLog(`${controllerName}-controller`, "Successful.", JSON.stringify({ records: records, decoded: decoded, token: token }));

            // ? Need to return all the properties of the user? -- 03/28/2021 MF
            // request.user = records[0];
            request.user = { userID: records[0].userID };
            // console.log(controllerName, getDateTime(), "request.user", request.user);
            return next();

          };

        })
        .catch(error => next(error));

    } else {

      request.errors = error;

      addErrorLog(`${controllerName}-controller`, "Unauthorized.", JSON.stringify({ decoded: decoded, token: token }), null);

      return response.status(401).json({ transactionSuccess: false, errorOccurred: true, isLoggedIn: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateSession;