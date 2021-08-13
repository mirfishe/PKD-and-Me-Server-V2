const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const controllerName = "media";
const tableName = "media";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];


/******************************
 ***** Get Media *********
 ******************************/
// * Returns all media active or not
// router.get("/list", (req, res) => {
router.get("/", (req, res) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    // .then((records) => {

    // ! pm2 doesn't see the .env variables being used here.
    //   if (process.env.DATABASE_DIALECT == "mysql") {

    //     return convertBitTrueFalse(records);

    //   } else {

    //     return records;

    //   };

    // })
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " get /list " + tableName, records);

        res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " get /list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " get /list error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/******************************
 ***** Get Media *********
 ******************************/
// router.get("/", (req, res) => {

//   const where = { active: true };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get / " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get / No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get / error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/******************************
 ***** Get Media Admin *********
 ******************************/
// * Return all categories to adminster them
// router.get("/admin", validateAdmin, (req, res) => {

//   db.select(select)
//     .from(tableName)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /admin " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /admin No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /admin error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Media By MediaID *****
***************************************/
// router.get("/:mediaID", (req, res) => {

//   const where = { mediaID: req.params.mediaID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .orderBy(orderBy)
//     .then((records) => {
//       // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID records", records);

//       records = convertBitTrueFalse(records);

//       // ! If statement doesn't get the value to check because the code goes to the .catch block when the results are null using findOne.
//       // if (records === null) {
//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });
//         // res.status(200).json({
//         //     media:   records.media,
//         //     sortID:     records.sortID,
//         //     active:     records.active,
//         //     message:    "Successfully retrieved " + tableName + " information."
//         //     });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


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

      // console.log(controllerName + "-controller", GetDateTime(), " maxSortID", maxSortID);
      if (isNaN(maxSortID)) {
        // newSortID = 1;
        return 1;
      } else {
        // newSortID = maxSortID + 1;
        return maxSortID + 1;
      };

    })
    .then((newSortID) => {
      // console.log(controllerName + "-controller", GetDateTime(), " newSortID", newSortID);

      const recordObject = {
        media: req.body.media.media,
        electronic: req.body.media.electronic,
        sortID: newSortID
      };

      return db(tableName)
        // * .returning() is not supported by mysql and will not have any effect.
        // .returning(select)
        .insert(recordObject);

    })
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
      // * Returns the ID value of the added record.

      // records = convertBitTrueFalse(records);

      recordObject.mediaID = records[0];

      if (records > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

        res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: [recordObject] });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
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
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID records", records);
      // * Returns the number of updated records.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID records", records);

        res.status(200).json({ recordUpdated: true, message: "Successfully updated " + tableName + ".", records: [recordObject] });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordUpdated: false, message: "Nothing to update.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID error", error);
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
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID records", records);
      // * Returns the number of deleted records.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID records", records);

        res.status(200).json({ recordDeleted: true, message: "Successfully deleted " + tableName + ".", mediaID: req.params.mediaID });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordDeleted: false, message: "Nothing to delete.", mediaID: req.params.mediaID });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;