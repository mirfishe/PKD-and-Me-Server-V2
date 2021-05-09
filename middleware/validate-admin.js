const jwt = require("jsonwebtoken");
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);


const controllerName = "validateAdmin";
const tableName = "users";
const select = "*";


const validateAdmin = (req, res, next) => {

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    // console.log(controllerName + " token: ", token);
    // console.log(controllerName + " decoded: ", decoded);

    if (!error && decoded) {
      // console.log(controllerName + " !error && decoded");

      const where = { userID: decoded.userID, admin: true, active: true };

      db.select(select)
        .from(tableName)
        .where(where)
        .then(records => {
          // console.log(controllerName + " records", records);

          // if (!records) throw {isAdmin: false, message: "Unauthorized."} // "Unauthorized."; // "error";
          if (!records) {
            return res.status(401).json({ isAdmin: false, message: "Unauthorized." });
          };

          // ? Need to return all the properties of the user?
          // req.user = records;
          req.user = { userID: records.userID };
          // console.log(controllerName + " req.user", req.user);
          return next();

        })
        .catch(error => next(error));

    } else {
      // console.log(controllerName + " req.errors = error");

      req.errors = error;
      // return res.status(401).send({isAdmin: false, message: "Unauthorized."})
      return res.status(401).json({ isAdmin: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateAdmin;