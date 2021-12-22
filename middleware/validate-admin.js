"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);

// const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");

// const controllerName = "validateAdmin";
const tableName = "users";
const select = "*";


const validateAdmin = (request, response, next) => {

  const token = request.headers.authorization;

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
  // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  jwt.verify(token, jwtSecret, (error, decoded) => {
    // console.log(controllerName, GetDateTime(), "token: ", token);
    // console.log(controllerName, GetDateTime(), "decoded: ", decoded);

    if (!error && decoded) {
      // console.log(controllerName, GetDateTime(), "!error && decoded");

      const where = { userID: decoded.userID, admin: true, active: true };

      db.select(select)
        .from(tableName)
        .where(where)
        .then(records => {
          // console.log(controllerName, GetDateTime(), "records", records);

          // if (!records) throw {isAdmin: false, message: "Unauthorized."} // "Unauthorized."; // "error";
          if (!records) {

            return response.status(401).json({ isAdmin: false, message: "Unauthorized." });

          };

          // ? Need to return all the properties of the user? -- 03/28/2021 MF
          // request.user = records[0];
          request.user = { userID: records[0].userID };
          // console.log(controllerName, GetDateTime(), "request.user", request.user);
          return next();

        })
        .catch(error => next(error));

    } else {

      request.errors = error;
      // return response.status(401).send({isAdmin: false, message: "Unauthorized."})
      return response.status(401).json({ isAdmin: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateAdmin;