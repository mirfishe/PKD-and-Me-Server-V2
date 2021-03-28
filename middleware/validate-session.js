const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/user");
const { Op } = require("sequelize");

const validateSession = (req, res, next) => {

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // console.log("validateSession token: ", token);
    // console.log("validateSession decoded: ", decoded);
    if (!err && decoded) {
      User.findOne({
        where: {
          [Op.and]: [
            { userID: { [Op.eq]: decoded.userID } },
            { active: { [Op.eq]: true } }
          ]
        }
      })
        .then(user => {
          // if (!user) throw "Unauthorized."; // "err";
          if (!user) {
            return res.status(401).json({ isLoggedIn: false, message: "Unauthorized." })
          };
          // ? Need to return all the properties of the user?
          // req.user = user;
          req.user = { userID: user.userID };
          return next();
        })
        .catch(err => next(err))
    } else {
      req.errors = err;
      // return res.status(401).send("Unauthorized.")
      return res.status(401).json({ isLoggedIn: false, message: "Unauthorized." })
    };

  });
};

module.exports = validateSession;