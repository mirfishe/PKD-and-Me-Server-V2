const jwt = require("jsonwebtoken");
const User = require("../db").import("../models/user");
const { Op } = require("sequelize");

const validateAdmin = (req, res, next) => {

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // console.log("validateAdmin token: ", token);
    // console.log("validateAdmin decoded: ", decoded);
    if (!err && decoded) {
      // console.log("validateAdmin !err && decoded");
      User.findOne({
        where: {
          [Op.and]: [
            { userID: { [Op.eq]: decoded.userID } },
            { admin: { [Op.eq]: true } },
            { active: { [Op.eq]: true } }
          ]
        }
      })
        .then(user => {
          // console.log("validateAdmin user", user);
          // if (!user) throw {isAdmin: false, message: "Unauthorized."} // "Unauthorized."; // "err";
          if (!user) {
            return res.status(401).json({ isAdmin: false, message: "Unauthorized." })
          };
          // ? Need to return all the properties of the user?
          // req.user = user;
          req.user = { userID: user.userID };
          // console.log("validateAdmin req.user", req.user);
          return next();
        })
        .catch(err => next(err))
    } else {
      // console.log("validateAdmin req.errors = err");
      req.errors = err;
      // return res.status(401).send({isAdmin: false, message: "Unauthorized."})
      return res.status(401).json({ isAdmin: false, message: "Unauthorized." })
    };

  });
};

module.exports = validateAdmin;