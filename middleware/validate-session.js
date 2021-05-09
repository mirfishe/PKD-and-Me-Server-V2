const jwt = require("jsonwebtoken");
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);


const controllerName = "validateSession";
const tableName = "users";
const select = "*";


const validateSession = (req, res, next) => {


  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    // console.log("controllerName + " token: ", token);
    // console.log("controllerName + " decoded: ", decoded);

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

          // ? Need to return all the properties of the user?
          // req.user = records;
          req.user = { userID: records.userID };
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