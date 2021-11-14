"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);

// const IsEmpty = require("../utilities/isEmpty");
// const GetDateTime = require("../utilities/getDateTime");

// const controllerName = "validateSession";
const tableName = "users";
const select = "*";


const validateSession = (req, res, next) => {

  const token = req.headers.authorization;

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
  // jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  jwt.verify(token, jwtSecret, (error, decoded) => {
    // console.log(controllerName, GetDateTime(), "token: ", token);
    // console.log(controllerName, GetDateTime(), "decoded: ", decoded);

    if (!error && decoded) {

      const where = { userID: decoded.userID, active: true };

      db.select(select)
        .from(tableName)
        .where(where)
        .then(records => {

          // if (!records) throw "Unauthorized."; // "error";
          if (!records) {
            return res.status(401).json({ isLoggedIn: false, message: "Unauthorized." });
          };

          // ? Need to return all the properties of the user? -- 03/28/2021 MF
          // req.user = records[0];
          req.user = { userID: records[0].userID };
          // console.log(controllerName, GetDateTime(), "req.user", req.user);
          return next();

        })
        .catch(error => next(error));

    } else {

      req.errors = error;
      // return res.status(401).send("Unauthorized.")
      return res.status(401).json({ isLoggedIn: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateSession;