const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const controllerName = "media";
const tableName = "media";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];


/******************************
 ***** Get Media List *********
 ******************************/
// * Returns all media active or not
router.get("/list", (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(controllerName + "-controller get /list " + tableName, records);

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
 ***** Get Media *********
 ******************************/
router.get("/", (req, res) => {

  const where = { active: true };

  db.select(select)
    .from(tableName)
    .where(where)
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


/******************************
 ***** Get Media Admin *********
 ******************************/
// * Return all categories to adminster them
router.get("/admin", validateAdmin, (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    .then((records) => {

      if (records.length > 0) {
        // console.log(controllerName + "-controller get /admin " + tableName, records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /admin No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller get /admin error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/**************************************
 ***** Get Media By MediaID *****
***************************************/
router.get("/:mediaID", (req, res) => {

  const where = { mediaID: req.params.mediaID };

  db.select(select)
    .from(tableName)
    .where(where)
    .orderBy(orderBy)
    .then((records) => {
      // console.log(controllerName + "-controller get /:" + controllerName + "ID records", records);

      // ! If statement doesn't get the value to check because the code goes to the .catch block when the results are null using findOne.
      // if (records === null) {
      if (records.length > 0) {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });
        // res.status(200).json({
        //     media:   records.media,
        //     sortID:     records.sortID,
        //     active:     records.active,
        //     message:    "Successfully retrieved " + tableName + " information."
        //     });

      } else {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /:" + controllerName + "ID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/* ******************************
 *** Add Media ***************
*********************************/
// * Allows an admin to add a new media
router.post("/", validateAdmin, (req, res) => {

  // ! Don't need this anymore; was trying to fix scoping issues
  // let newSortID = 0;

  // * Moved this inside the function for scoping issues with newSortID
  // const createMedia = {
  //     media:      req.body.media.media,
  //     sortID:     newSortID
  //   };

  db.queryBuilder()
    .from(tableName)
    .max("sortID")
    .first() // * Add this to get an object.
    .then((maxSortID) => {

      // console.log(controllerName + "-controller maxSortID", maxSortID);
      if (isNaN(maxSortID)) {
        // newSortID = 1;
        return 1;
      } else {
        // newSortID = maxSortID + 1;
        return maxSortID + 1;
      };

    })
    .then((newSortID) => {
      // console.log(controllerName + "-controller newSortID", newSortID);

      const recordObject = {
        media: req.body.media.media,
        electronic: req.body.media.electronic,
        sortID: newSortID
      };

      return db(tableName)
        .returning(select)
        .insert(recordObject);

    })
    .then((records) => {
      // console.log(controllerName + "-controller post / records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller post / records", records);

        res.status(200).json({ records: records, recordAdded: true, message: "Successfully created " + tableName + "." });

      } else {
        console.log(controllerName + "-controller post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordAdded: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller post / error", error);
      res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
    });

});


/***************************
 ******* Update Media *******
 ***************************/
// * Allows an admin to update the media including soft delete it
router.put("/:mediaID", validateAdmin, (req, res) => {

  const where = { mediaID: req.params.mediaID };

  const recordObject = {
    media: req.body.media.media,
    sortID: req.body.media.sortID,
    active: req.body.media.active
  };

  db(tableName)
    .where(where)
    .returning(select)
    .update(recordObject)
    .then((records) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordUpdated: true, message: "Successfully updated " + tableName + "." });

      } else {
        console.log(controllerName + "-controller put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordUpdated: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID error", error);
      res.status(500).json({ recordUpdated: false, message: "Not successfully updated " + tableName + ".", error: error });
    });

});


/***************************
 ******* Delete Media *******
 ***************************/
// * Allows an admin to hard delete the media
router.delete("/:mediaID", validateAdmin, (req, res) => {

  const where = { mediaID: req.params.mediaID };

  db(tableName)
    .where(where)
    .returning(select)
    .del()
    .then((records) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordDeleted: true, message: "Successfully deleted " + tableName + "." });

      } else {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordDeleted: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;