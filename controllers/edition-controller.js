const router = require('express').Router();
const Edition = require('../db').import('../models/edition');
const Media = require("../db").import("../models/media");
const Title = require("../db").import("../models/title");
const { Op } = require("sequelize");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Edition List *********
 ******************************/
// * Returns all editions active or not
router.get("/list", (req, res) => {

  const query = {/*where: {
        active: {[Op.eq]: true}
    },*/ include: [
      {
        model: Title,
        // right: true,
        required: false,
        // where: {
        //     active: {[Op.eq]: true}
        // }
      },
      {
        model: Media,
        // right: true,
        required: false,
        // where: {
        //     active: {[Op.eq]: true}
        // }
      }
    ],
    order: [["publicationDate", 'DESC']]
  };

  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get / editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved editions." });
      } else {
        // console.log("edition-controller get / No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/******************************
 ***** Get Editions *********
 ******************************/
router.get("/", (req, res) => {

  const query = {
    where: {
      active: { [Op.eq]: true }
    }, include: [
      {
        model: Title,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Media,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [["publicationDate", 'DESC']]
  };

  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get / editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved editions." });
      } else {
        // console.log("edition-controller get / No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/**************************************
 ***** Get Edition By EditionID *****
***************************************/
router.get("/:editionID", (req, res) => {

  const query = {
    where: {
      editionID: { [Op.eq]: req.params.editionID }
    }, include: [
      {
        model: Title,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Media,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ]
  };

  // Edition.findOne(query)
  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get /:editionID editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved edition." });
        // res.status(200).json({
        // editionID:  edition.editionID,
        // titleID:    edition.titleID,
        // mediaID:    edition.mediaID,
        // amazonLinkID:   edition.amazonLinkID,
        // publicationDate:  edition.publicationDate,
        // imageName:  edition.imageName,
        // ASIN:              edition.ASIN,
        // textLinkShort:     edition.textLinkShort,
        // textLinkFull:     edition.textLinkFull,
        // imageLinkSmall:     edition.imageLinkSmall,
        // imageLinkMedium:     edition.imageLinkMedium,
        // imageLinkLarge:     edition.imageLinkLarge,
        // textImageLink:     edition.textImageLink,
        // active:     edition.active,
        // message:    'Successfully retrieved edition.'
        // });
      } else {
        // console.log("edition-controller get /:editionID No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get /:editionID err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/**************************************
 ***** Get Edition By ASIN *****
***************************************/
router.get("/ASIN/:ASIN", (req, res) => {

  const query = {
    where: {
      ASIN: { [Op.eq]: req.params.ASIN }
    }, include: [
      {
        model: Title,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Media,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ]
  };

  // Edition.findOne(query)
  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get /:editionID editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved edition." });
        // res.status(200).json({
        // editionID:  edition.editionID,
        // titleID:    edition.titleID,
        // mediaID:    edition.mediaID,
        // amazonLinkID:   edition.amazonLinkID,
        // publicationDate:  edition.publicationDate,
        // imageName:  edition.imageName,
        // ASIN:              edition.ASIN,
        // textLinkShort:     edition.textLinkShort,
        // textLinkFull:     edition.textLinkFull,
        // imageLinkSmall:     edition.imageLinkSmall,
        // imageLinkMedium:     edition.imageLinkMedium,
        // imageLinkLarge:     edition.imageLinkLarge,
        // textImageLink:     edition.textImageLink,
        // active:     edition.active,
        // message:    'Successfully retrieved edition.'
        // });
      } else {
        // console.log("edition-controller get /:editionID No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get /:editionID err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/**************************************
 ***** Get Editions By TitleID *****
***************************************/
router.get("/title/:titleID", (req, res) => {

  const query = {
    where: {
      [Op.and]: [
        { titleID: { [Op.eq]: req.params.titleID } },
        { active: { [Op.eq]: true } }
      ]
    }, include: [
      {
        model: Title,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Media,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [["publicationDate", 'DESC']]
  };

  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get /title/:titleID editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved editions." });
      } else {
        // console.log("edition-controller get /title/:titleID No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get /title/:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/**************************************
 ***** Get Editions By MediaID *****
***************************************/
router.get("/media/:mediaID", (req, res) => {

  const query = {
    where: {
      [Op.and]: [
        { mediaID: { [Op.eq]: req.params.mediaID } },
        { active: { [Op.eq]: true } }
      ]
    }, include: [
      {
        model: Title,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Media,
        // right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [["publicationDate", 'DESC']]
  };

  Edition.findAll(query)
    .then((editions) => {
      if (editions.length > 0) {
        // console.log("edition-controller get /media/:mediaID editions", editions);
        res.status(200).json({ editions: editions, resultsFound: true, message: "Successfully retrieved editions." });
      } else {
        // console.log("edition-controller get /media/:mediaID No Results");
        // res.status(200).send("No editions found.");
        // res.status(200).send({resultsFound: false, message: "No editions found."})
        res.status(200).json({ resultsFound: false, message: "No editions found." });
      };
    })
    .catch((err) => {
      console.log("edition-controller get /media/:mediaID err", err);
      res.status(500).json({ resultsFound: false, message: "No editions found.", error: err });
    });

});

/**************************************
 ***** Get Editions By CategoryID *****
***************************************/
// ? Needed? Use Get Titles instead?
// ! There is no column for categoryID in the editions table
// ! Query needs to be changed to work
// router.get("/category/:categoryID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//             {categoryID: {[Op.eq]: req.params.categoryID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["publicationDate", 'DESC']]};

//     Edition.findAll(query)
//     .then((editions) => {
//         // console.log("edition-controller get /category/:categoryID editions", editions);
//         res.status(200).json({editions: editions, message: "Successfully retrieved editions."});
//     })
//     .catch((err) => {
//         console.log("edition-controller get /category/:categoryIDerr", err);
//         res.status(500).json({resultsFound: false, message: "No editions found.", error: err});
//     });

// });

/* ******************************
 *** Add Edition ***************
*********************************/
// * Allows an admin to add a new edition
router.post('/', validateAdmin, (req, res) => {

  const createEdition = {
    titleID: req.body.edition.titleID,
    mediaID: req.body.edition.mediaID,
    publicationDate: req.body.edition.publicationDate,
    imageName: req.body.edition.imageName,
    ASIN: req.body.edition.ASIN,
    textLinkShort: req.body.edition.textLinkShort,
    textLinkFull: req.body.edition.textLinkFull,
    imageLinkSmall: req.body.edition.imageLinkSmall,
    imageLinkMedium: req.body.edition.imageLinkMedium,
    imageLinkLarge: req.body.edition.imageLinkLarge,
    textImageLink: req.body.edition.textImageLink
  };

  Edition.create(createEdition)
    .then((edition) => {
      // console.log("edition-controller post / edition", edition);
      res.status(200).json({
        editionID: edition.editionID,
        titleID: edition.titleID,
        mediaID: edition.mediaID,
        publicationDate: edition.publicationDate,
        imageName: edition.imageName,
        ASIN: edition.ASIN,
        textLinkShort: edition.textLinkShort,
        textLinkFull: edition.textLinkFull,
        imageLinkSmall: edition.imageLinkSmall,
        imageLinkMedium: edition.imageLinkMedium,
        imageLinkLarge: edition.imageLinkLarge,
        textImageLink: edition.textImageLink,
        active: edition.active,
        createdAt: edition.createdAt,
        updatedAt: edition.updatedAt,
        recordAdded: true,
        message: 'Edition successfully created.'
      });
    })
    .catch((err) => {
      console.log("edition-controller post / err", err);
      // console.log("edition-controller post / err.name", err.name);
      // console.log("edition-controller post / err.errors[0].message", err.errors[0].message);

      let errorMessages = "";
      for (let i = 0; i < err.errors.length; i++) {
        //console.log("edition-controller post / err.errors[i].message", err.errors[i].message);
        if (i > 1) {
          errorMessages = errorMessages + ", ";
        };
        errorMessages = errorMessages + err.errors[i].message;
      };

      res.status(500).json({ recordAdded: false, message: "Edition not successfully created.", errorMessages: errorMessages, error: err });
    });

});

/***************************
 ******* Update Edition *******
 ***************************/
// * Allows the admin to update the edition including soft delete it
router.put("/:editionID", validateAdmin, (req, res) => {

  const updateEdition = {
    titleID: req.body.edition.titleID,
    mediaID: req.body.edition.mediaID,
    publicationDate: req.body.edition.publicationDate,
    imageName: req.body.edition.imageName,
    ASIN: req.body.edition.ASIN,
    textLinkShort: req.body.edition.textLinkShort,
    textLinkFull: req.body.edition.textLinkFull,
    imageLinkSmall: req.body.edition.imageLinkSmall,
    imageLinkMedium: req.body.edition.imageLinkMedium,
    imageLinkLarge: req.body.edition.imageLinkLarge,
    textImageLink: req.body.edition.textImageLink,
    active: req.body.edition.active
  };

  const query = {
    where: {
      editionID: { [Op.eq]: req.params.editionID }
    }
  };

  Edition.update(updateEdition, query)
    // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated.
    // .then((edition) => res.status(200).json({message: edition + " edition record(s) successfully updated."}))
    .then((edition) => {
      if (edition > 0) {
        res.status(200).json({
          editionID: parseInt(req.params.editionID), // * The parameter value is passed as a string unless converted
          titleID: req.body.edition.titleID,
          mediaID: req.body.edition.mediaID,
          publicationDate: req.body.edition.publicationDate,
          imageName: req.body.edition.imageName,
          ASIN: req.body.edition.ASIN,
          textLinkShort: req.body.edition.textLinkShort,
          textLinkFull: req.body.edition.textLinkFull,
          imageLinkSmall: req.body.edition.imageLinkSmall,
          imageLinkMedium: req.body.edition.imageLinkMedium,
          imageLinkLarge: req.body.edition.imageLinkLarge,
          textImageLink: req.body.edition.textImageLink,
          active: req.body.edition.active,
          recordUpdated: true,
          // message:    'Edition successfully updated.'
          message: edition + " edition record(s) successfully updated."
        });
      } else {
        res.status(200).json({ recordUpdated: false, message: edition + " edition record(s) successfully updated." });
      };
    })
    .catch((err) => {
      console.log("edition-controller put /:editionID err", err);
      // console.log("edition-controller put /:editionID  err.name", err.name);
      // console.log("edition-controller put /:editionID  err.errors[0].message", err.errors[0].message);

      let errorMessages = "";
      for (let i = 0; i < err.errors.length; i++) {
        //console.log("edition-controller put /:editionID  err.errors[i].message", err.errors[i].message);
        if (i > 1) {
          errorMessages = errorMessages + ", ";
        };
        errorMessages = errorMessages + err.errors[i].message;
      };

      res.status(500).json({ recordUpdated: false, message: "Edition not successfully updated.", errorMessages: errorMessages, error: err });
    });

});

/***************************
 ******* Delete Edition *******
 ***************************/
// * Allows an admin to hard delete an edition
router.delete("/:editionID", validateAdmin, (req, res) => {

  const query = {
    where: {
      editionID: { [Op.eq]: req.params.editionID }
    }
  };

  Edition.destroy(query)
    .then(() => res.status(200).json({ recordDeleted: true, message: "Edition successfully deleted." }))
    .catch((err) => {
      console.log("edition-controller delete /:editionID err", err);
      res.status(500).json({ recordDeleted: false, message: "Edition not successfully deleted.", error: err });
    });

});

module.exports = router;