"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "errors";
const tableName = "errors";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];

let records;


/******************************
 ***** Get Errors *********
 ******************************/
router.get("/", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

        res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

        // res.status(200).send(`No ${tableName} found.`);
        // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

    });

});


/**************************************
 ***** Get Error By ErrorID *****
***************************************/
// router.get("/:errorID", validateAdmin, (req, res) => {

//   const where = { errorID: req.params.errorID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .then((records) => {

//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:errorID ${tableName}`, records);

//         res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${controllerName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /:errorID No Results");

//         // res.status(200).send(`No ${tableName} found.`);
//         // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /:errorID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /:errorID", records, error);
//       res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/* ******************************
 *** Add Error ***************
*********************************/
router.post("/", (req, res) => {

  const recordObject = {
    operation: req.body.recordObject.operation,
    componentName: req.body.recordObject.componentName,
    transactionData: JSON.stringify(req.body.recordObject.transactionData),
    errorData: JSON.stringify(req.body.recordObject.errorData),
    createDate: req.body.recordObject.createDate
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      recordObject.errorID = records[0];

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
        res.status(200).json({ recordAdded: true, message: `Successfully created ${controllerName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      res.status(500).json({ recordAdded: false, message: `Not successfully created ${controllerName}.`, error: error });

    });

});


module.exports = router;