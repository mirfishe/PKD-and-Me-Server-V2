const jwt = require("jsonwebtoken");
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);


const validateAdmin = (req, res, next) => {

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    // console.log("validateAdmin token: ", token);
    // console.log("validateAdmin decoded: ", decoded);

    if (!error && decoded) {
      // console.log("validateAdmin !error && decoded");

      db.select("*")
        .from("users")
        .where({
          userID: decoded.userID,
          admin: true,
          active: true
        })
        .then(user => {
          // console.log("validateAdmin user", user);

          // if (!user) throw {isAdmin: false, message: "Unauthorized."} // "Unauthorized."; // "error";
          if (!user) {
            return res.status(401).json({ isAdmin: false, message: "Unauthorized." });
          };

          // ? Need to return all the properties of the user?
          // req.user = user;
          req.user = { userID: user.userID };
          // console.log("validateAdmin req.user", req.user);
          return next();

        })
        .catch(error => next(error));

    } else {
      // console.log("validateAdmin req.errors = error");

      req.errors = error;
      // return res.status(401).send({isAdmin: false, message: "Unauthorized."})
      return res.status(401).json({ isAdmin: false, message: "Unauthorized." });

    };

  });

};


module.exports = validateAdmin;