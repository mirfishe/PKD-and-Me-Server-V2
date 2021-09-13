const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");

const controllerName = "comments";
const tableName = "comments";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];


/******************************
 ***** Get Comments *********
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
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });
    });

});


/**************************************
 ***** Get Comment By commentID *****
***************************************/
router.get("/:commentID", validateAdmin, (req, res) => {

  const where = { commentID: req.params.commentID };

  db.select(select)
    .from(tableName)
    .where(where)
    .then((records) => {

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

        res.status(200).json({ resultsFound: true, message: `Successfully retrieved ${controllerName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

        // res.status(200).send(`No ${tableName} found.`);
        // res.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        res.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);
      res.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });
    });

});


/* ******************************
 *** Add Comment ***************
*********************************/
router.post("/", /*validateSession,*/(req, res) => {

  const recordObject = {
    // userID: req.user.userID,
    userID: req.body.comment.userID,
    email: req.body.comment.email,
    comment: req.body.comment.comment
    // dateEntered: req.body.recordObject.dateEntered
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record.

      recordObject.commentID = records[0];

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
      res.status(500).json({ recordAdded: false, message: `Not successfully created ${controllerName}.`, error: error });
    });

});


module.exports = router;