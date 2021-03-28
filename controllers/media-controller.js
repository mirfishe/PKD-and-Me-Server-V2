const router = require("express").Router();
const Media = require("../db").import("../models/media");
const { Op } = require("sequelize");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Media List *********
 ******************************/
// * Returns all media active or not
router.get("/list", (req, res) => {

  const query = {/*where: {
        active: {[Op.eq]: true}
    // }, include: {all: true, nested: true}, order: [["sortID", "ASC"]]};
    },*/ order: [["sortID", "ASC"]]
  };

  Media.findAll(query)
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

  const query = {
    where: {
      active: { [Op.eq]: true }
      // }, include: {all: true, nested: true}, order: [["sortID", "ASC"]]};
    }, order: [["sortID", "ASC"]]
  };

  Media.findAll(query)
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

  const query = { order: [["sortID", "ASC"]] };

  Media.findAll(query)
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

  const query = {
    where: {
      mediaID: { [Op.eq]: req.params.mediaID }
      // }, include: {all: true, nested: true}};
    }
  };

  // Media.findOne(query)
  Media.findAll(query)
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

  Media.max("sortID")
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

      const createMedia = {
        media: req.body.media.media,
        electronic: req.body.media.electronic,
        sortID: newSortID
      };

      return Media.create(createMedia);
    })
    // .then((media) => res.status(200).json({media: media, message: "Media successfully created."}))
    .then((media) => {
      // console.log("media-controller post / media", media);
      res.status(200).json({
        mediaID: media.mediaID,
        media: media.media,
        electronic: media.electronic,
        sortID: media.sortID,
        active: media.active,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
        recordAdded: true,
        message: "Media successfully created."
      });
    })
    .catch((err) => {
      console.log("media-controller post / err", err);
      res.status(500).json({ recordAdded: false, message: "Media not successfully created.", error: err });
    });

});

/***************************
 ******* Update Media *******
 ***************************/
// * Allows an admin to update the media including soft delete it
router.put("/:mediaID", validateAdmin, (req, res) => {

  const updateMedia = {
    media: req.body.media.media,
    sortID: req.body.media.sortID,
    active: req.body.media.active
  };

  const query = {
    where: {
      mediaID: { [Op.eq]: req.params.mediaID }
    }
  };

  Media.update(updateMedia, query)
    // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated.
    // .then((media) => res.status(200).json({message: media + " media record(s) successfully updated."}))
    .then((media) => {
      if (media > 0) {
        res.status(200).json({
          mediaID: parseInt(req.params.mediaID), // * The parameter value is passed as a string unless converted
          media: req.body.media.media,
          sortID: req.body.media.sortID,
          active: req.body.media.active,
          recordUpdated: true,
          // message:    "Media successfully updated."
          message: media + " media record(s) successfully updated."
        });
      } else {
        res.status(200).json({ recordUpdated: false, message: media + " media record(s) successfully updated." });
      };
    })
    .catch((err) => {
      console.log("media-controller put /:mediaID err", err);
      res.status(500).json({ recordUpdated: false, message: "Media not successfully updated.", error: err });
    });

});

/***************************
 ******* Delete Media *******
 ***************************/
// * Allows an admin to hard delete the media
router.delete("/:mediaID", validateAdmin, (req, res) => {

  const query = {
    where: {
      mediaID: { [Op.eq]: req.params.mediaID }
    }
  };

  Media.destroy(query)
    .then(() => res.status(200).json({ recordDeleted: true, message: "Media successfully deleted." }))
    .catch((err) => {
      console.log("media-controller delete /:mediaID err", err);
      res.status(500).json({ recordDeleted: false, message: "Media not successfully deleted.", error: err });
    });

});

module.exports = router;