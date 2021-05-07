const router = require("express").Router();
const dbConfig = require("../db");
const db = require('knex')(dbConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Media List *********
 ******************************/
// * Returns all media active or not
router.get("/list", (req, res) => {

  db.select("*")
    .from("media")
    .orderBy("sortID")
    .then((media) => {
      if (media.length > 0) {
        // console.log("media-controller get / media", media);
        res.status(200).json({ media: media, resultsFound: true, message: "Successfully retrieved media." });
      } else {
        // console.log("media-controller get / No Results");
        // res.status(200).send("No media found.");
        // res.status(200).send({resultsFound: false, message: "No media found."})
        res.status(200).json({ resultsFound: false, message: "No media found." });
      };
    })
    .catch((err) => {
      console.log("media-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No media found.", error: err });
    });

});

/******************************
 ***** Get Media *********
 ******************************/
router.get("/", (req, res) => {

  db.select("*")
    .from("media")
    .where({ active: true })
    .orderBy("sortID")
    .then((media) => {
      if (media.length > 0) {
        // console.log("media-controller get / media", media);
        res.status(200).json({ media: media, resultsFound: true, message: "Successfully retrieved media." });
      } else {
        // console.log("media-controller get / No Results");
        // res.status(200).send("No media found.");
        // res.status(200).send({resultsFound: false, message: "No media found."})
        res.status(200).json({ resultsFound: false, message: "No media found." });
      };
    })
    .catch((err) => {
      console.log("media-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No media found.", error: err });
    });

});

/******************************
 ***** Get Media Admin *********
 ******************************/
// * Return all categories to adminster them
router.get("/admin", validateAdmin, (req, res) => {

  db.select("*")
    .from("media")
    .orderBy("sortID")
    .then((media) => {
      if (media.length > 0) {
        // console.log("media-controller get / media", media);
        res.status(200).json({ media: media, resultsFound: true, message: "Successfully retrieved media." });
      } else {
        // console.log("media-controller get / No Results");
        // res.status(200).send("No media found.");
        // res.status(200).send({resultsFound: false, message: "No media found."})
        res.status(200).json({ resultsFound: false, message: "No media found." });
      };
    })
    .catch((err) => {
      console.log("media-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No media found.", error: err });
    });

});

/**************************************
 ***** Get Media By MediaID *****
***************************************/
router.get("/:mediaID", (req, res) => {

  db.select("*")
    .from("media")
    .where({ mediaID: req.params.mediaID })
    .orderBy("sortID")
    .then((media) => {
      // console.log("media-controller get /:mediaID media", media);
      // ! If statement doesn't get the value to check because the code goes to the .catch block when the results are null using findOne.
      // if (media === null) {
      if (media.length > 0) {
        // console.log("media-controller get /:mediaID media", media);
        res.status(200).json({ media: media, resultsFound: true, message: "Successfully retrieved media item." });
        // res.status(200).json({
        //     media:   media.media,
        //     sortID:     media.sortID,
        //     active:     media.active,
        //     message:    "Successfully retrieved media information."
        //     });
      } else {
        // console.log("media-controller get /:mediaID No Results");
        // res.status(200).send("No media found.");
        // res.status(200).send({resultsFound: false, message: "No media found."})
        res.status(200).json({ resultsFound: false, message: "No media found." });
      };
    })
    .catch((err) => {
      console.log("media-controller get /:mediaID err", err);
      res.status(500).json({ resultsFound: false, message: "No media found.", error: err });
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
    .from("media")
    .max("sortID")
    .first() // * Add this to get an object.
    .then((maxSortID) => {
      // console.log("media-controller maxSortID", maxSortID);
      if (isNaN(maxSortID)) {
        // newSortID = 1;
        return 1;
      } else {
        // newSortID = maxSortID + 1;
        return maxSortID + 1;
      };
    })
    .then((newSortID) => {
      // console.log("media-controller newSortID", newSortID);

      return db("media")
        .returning("*")
        .insert({
          media: req.body.media.media,
          electronic: req.body.media.electronic,
          sortID: newSortID
        });

    })
    .then((rows) => {
      console.log("media-controller post / rows", rows);
      if (rows.length > 0) {
        console.log("media-controller post / rows", rows);
        res.status(200).json({ rows: rows, recordAdded: true, message: "Successfully added." });
      } else {
        console.log("media-controller post / No Results");
        // res.status(200).send("No rows found.");
        // res.status(200).send({resultsFound: false, message: "No rows found."})
        res.status(200).json({ rows: rows, recordAdded: false, message: "Nothing to add." });
      };
    })
    .catch((error) => {
      console.log("media-controller post / error", error);
      res.status(500).json({ recordAdded: false, message: "Not successfully added.", error: error });
    });

});

/***************************
 ******* Update Media *******
 ***************************/
// * Allows an admin to update the media including soft delete it
router.put("/:mediaID", validateAdmin, (req, res) => {

  db("media")
    .where({ mediaID: req.params.mediaID })
    .returning("*")
    .update({
      media: req.body.media.media,
      sortID: req.body.media.sortID,
      active: req.body.media.active
    })
    .then((rows) => {
      console.log("media-controller put /:mediaID rows", rows);
      if (rows.length > 0) {
        console.log("media-controller put /:mediaID rows", rows);
        res.status(200).json({ rows: rows, recordUpdated: true, message: "Successfully updated." });
      } else {
        console.log("media-controller put /:mediaID No Results");
        // res.status(200).send("No rows found.");
        // res.status(200).send({resultsFound: false, message: "No rows found."})
        res.status(200).json({ rows: rows, recordUpdated: false, message: "Nothing to update." });
      };
    })
    .catch((error) => {
      console.log("media-controller put /:mediaID error", error);
      res.status(500).json({ recordUpdated: false, message: "Not successfully updated.", error: error });
    });

});

/***************************
 ******* Delete Media *******
 ***************************/
// * Allows an admin to hard delete the media
router.delete("/:mediaID", validateAdmin, (req, res) => {

  db("media")
    .where({ mediaID: req.params.mediaID })
    .returning("*")
    .del()
    .then((rows) => {
      console.log("media-controller delete /:mediaID rows", rows);
      if (rows.length > 0) {
        console.log("media-controller delete /:mediaID rows", rows);
        res.status(200).json({ rows: rows, recordDeleted: true, message: "Successfully deleted." });
      } else {
        console.log("media-controller delete /:mediaID No Results");
        // res.status(200).send("No rows found.");
        // res.status(200).send({resultsFound: false, message: "No rows found."})
        res.status(200).json({ rows: rows, recordDeleted: false, message: "Nothing to delete." });
      };
    })
    .catch((error) => {
      console.log("media-controller delete /:mediaID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted.", error: error });
    });

});

module.exports = router;