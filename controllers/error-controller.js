const router = require("express").Router();
const Error = require("../db").import("../models/error");
const { Op } = require("sequelize");
const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Errors *********
 ******************************/
router.get("/", validateAdmin, (req, res) => {

  const query = { order: [["errorDate", "DESC"]] };

  Error.findAll(query)
    .then((errors) => {
      if (errors.length > 0) {
        // console.log("error-controller get / errors", errors);
        res.status(200).json({ errors: errors, resultsFound: true, message: "Successfully retrieved errors." });
      } else {
        // console.log("error-controller get / No Results");
        // res.status(200).send("No errors found.");
        // res.status(200).send({resultsFound: false, message: "No errors found."})
        res.status(200).json({ resultsFound: false, message: "No errors found." });
      };
    })
    .catch((err) => {
      console.log("error-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No errors found.", error: err });
    });

});

/**************************************
 ***** Get Error By ErrorID *****
***************************************/
router.get("/:errorID", validateAdmin, (req, res) => {

  const query = {
    where: {
      errorID: { [Op.eq]: req.params.errorID }
    }
  };

  Error.findAll(query)
    .then((errors) => {
      if (errors.length > 0) {
        // console.log("error-controller get /:errorID errors", errors);
        res.status(200).json({ errors: errors, resultsFound: true, message: "Successfully retrieved error." });
      } else {
        // console.log("error-controller get /:errorID No Results");
        // res.status(200).send("No errors found.");
        // res.status(200).send({resultsFound: false, message: "No errors found."})
        res.status(200).json({ resultsFound: false, message: "No errors found." });
      };
    })
    .catch((err) => {
      console.log("error-controller get /:errorID err", err);
      res.status(500).json({ resultsFound: false, message: "No errors found.", error: err });
    });

});

/* ******************************
 *** Add Error ***************
*********************************/
router.post("/", (req, res) => {

  Error.create(createTitle)
    .then((error) => {
      // console.log("error-controller post / error", error);
      res.status(200).json({
        errorID: error.errorID,
        errorDate: error.errorDate,
        errorMessage: error.errorMessage,
        errorPage: error.errorPage,
        recordAdded: true,
        message: "Error successfully created."
      });
    })
    .catch((err) => {
      console.log("error-controller post / err", err);
      res.status(500).json({ recordAdded: false, message: "Error not successfully created.", error: err });
    });

});

module.exports = router;