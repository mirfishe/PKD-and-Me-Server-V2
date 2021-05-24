const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const convertBitTrueFalse = require("../utilities/sharedFunctions");

const controllerName = "category";
const tableName = "categories";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];


/******************************
 ***** Get Category List *********
 ******************************/
// * Returns all categories active or not
router.get("/list", (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        console.log(controllerName + "-controller get /list " + tableName, records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller get /list error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/******************************
 ***** Get Categories *********
 ******************************/
// * Only returns categories that have titles linked to them
// * Need to return all categories that are active for the add title function
router.get("/", (req, res) => {

  const where = { active: true };

  db.select(select)
    .from(tableName)
    .where(where)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        console.log(controllerName + "-controller get / " + tableName, records);

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


module.exports = router;