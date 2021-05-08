const jwt = require("jsonwebtoken");
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);


const validateSession = (req, res, next) => {

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    // console.log("validateSession token: ", token);
    // console.log("validateSession decoded: ", decoded);

    if (!error && decoded) {

      db.select("*")
        .from("users")
        .where({
          userID: decoded.userID,
          active: true
        })
        .then(user => {

          // if (!user) throw "Unauthorized."; // "error";
          if (!user) {
            return res.status(401).json({ isLoggedIn: false, message: "Unauthorized." });
          };

          // ? Need to return all the properties of the user?
          // req.user = user;
          req.user = { userID: user.userID };
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