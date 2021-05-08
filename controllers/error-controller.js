const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateAdmin = require("../middleware/validate-admin");

const controllerName = "error";
const tableName = "errors";
const select = "*";
const orderBy = [{ column: "errorDate", order: "desc" }];


/******************************
 ***** Get Errors *********
 ******************************/
router.get("/", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(controllerName + "-controller get / " + tableName, records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get / No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller get / error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/**************************************
 ***** Get Error By ErrorID *****
***************************************/
router.get("/:errorID", validateAdmin, (req, res) => {

  const where = { errorID: req.params.errorID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      if (records.length > 0) {
        // console.log(controllerName + "-controller get / " + tableName, records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + controllerName + "." });

      } else {
        // console.log(controllerName + "-controller get / No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller get / error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/* ******************************
 *** Add Error ***************
*********************************/
router.post("/", (req, res) => {

  const createError = {
    errorName: req.body.error.errorName
  };

  db(tableName)
    .returning("*")
    .insert(createError)
    .then((records) => {
      // console.log(controllerName + "-controller post / records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller post / records", records);
        res.status(200).json({ records: records, recordAdded: true, message: "Successfully created " + controllerName + "." });

      } else {
        console.log(controllerName + "-controller post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordAdded: false, message: "Nothing to add." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller post / err", err);
      res.status(500).json({ recordAdded: false, message: "Not successfully created " + controllerName + ".", error: err });
    });

});


module.exports = router;