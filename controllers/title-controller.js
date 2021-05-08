const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const controllerName = "title";
const tableName = "titles";
const select = "*";
const activeWhere = { "titles.active": true, "userReviews.active": true, "users.active": true, "categories.active": true, "editions.active": true, "media.active": true };
const orderBy = [{ column: "titleSort", order: "asc" }];


/******************************
 ***** Get Title List *********
 ******************************/
// * Returns all titles active or not
// * Just the title data and not the related tables data
router.get("/list", (req, res) => {

  db.select(select)
    .from(tableName)
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    .orderBy(orderBy)
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /list titles", titles);

        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /list err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/******************************
 ***** Get Titles *********
 ******************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where(activeWhere)
    .orderBy(orderBy)
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get / titles", titles);

        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get / No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get Title By TitleID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/:titleID", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where("titles.titleID", req.params.titleID)
    .where(activeWhere)
    .orderBy(orderBy)
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID title", title);

        // res.status(200).json({
        // titleID:   title.titleID,
        // titleName:     title.titleName,
        // titleSort:  title.titleSort,
        // authorFirstName:   title.authorFirstName,
        // authorLastName:     title.authorLastName,
        // publicationDate:  title.publicationDate,
        // imageName:   title.imageName,
        // categoryID:   title.categoryID,
        // shortDescription:     title.shortDescription,
        // urlPKDweb:  title.urlPKDweb,
        // active:     title.active,
        // message:    "Successfully retrieved " + tableName + "."
        // });
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

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


/**************************************
 ***** Get Titles By MediaID *****
***************************************/
// ? Needed? Use Get Editions instead?
// ! There is no column for mediaID in the titles table
// ! Query needs to be changed to work
// ? ADD OVERALL RATING TO GET TITLE?
// router.get("/media/:mediaID", (req, res) => {

//     // const attributes = {
//     //     attributes: [
//     //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
//     //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
//     //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
//     //     ]
//     // };

//     const query = {where: {
//         [Op.and]: [
//             {mediaID: {[Op.eq]: req.params.mediaID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["titleSort", "DESC"]]};

//     Title.findAll(query)
//     .then((titles) => {
//         // console.log(controllerName + "-controller get /media/:mediaID" titles", titles);
//         res.status(200).json({titles: titles, message: "Successfully retrieved " + tableName + "."});
//     })
//         .catch((err) => {
//             console.log(controllerName + "-controller get /media/:mediaID err", err);
//             res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         });

// });


/**************************************
 ***** Get Titles By CategoryID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/category/:categoryID/:sort?", (req, res) => {

  let orderByColumn = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderByColumn = "publicationDate";
  } else {
    orderByColumn = "titleSort";
  };

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where("titles.categoryID", req.params.categoryID)
    .where(activeWhere)
    .orderBy([{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }])
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /category/:categoryID titles", titles);

        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /category/:categoryID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /category/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get Titles By CategoryID Admin *****
***************************************/
// * Return all titles to adminster them
router.get("/admin/category/:categoryID/:sort?", validateAdmin, (req, res) => {

  let orderByColumn = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderByColumn = "publicationDate";
  } else {
    orderByColumn = "titleSort";
  };

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where("titles.categoryID", req.params.categoryID)
    // .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .where("categories.active", true)
    // .where("editions.active", true)
    // .where("media.active", true)
    .orderBy([{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }])
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /category/:categoryID titles", titles);

        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /category/:categoryID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /category/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get Titles/Checklist *****
***************************************/
router.get("/checklist/list", validateSession, (req, res) => {

  let orderByColumn = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderByColumn = "publicationDate";
  } else {
    orderByColumn = "titleSort";
  };

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.userID", req.user.userID)
    .where("users.active", true)
    .where("categories.active", true)
    // .where("editions.active", true)
    // .where("media.active", true)
    .orderBy([{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }])
    .then((titles) => {

      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /checklist/:categoryID titles", titles);

        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /checklist/:categoryID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /checklist/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get Titles/Checklist By CategoryID *****
***************************************/
router.get("/checklist/:categoryID/:sort?", validateSession, (req, res) => {

  let orderByColumn = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderByColumn = "publicationDate";
  } else {
    orderByColumn = "titleSort";
  };

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.reviewID", "titles.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where("titles.categoryID", req.params.categoryID)
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.userID", req.user.userID)
    .where("users.active", true)
    .where("categories.active", true)
    // .where("editions.active", true)
    // .where("media.active", true)
    .orderBy([{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }])
    .then((titles) => {
      if (titles.length > 0) {
        // console.log(controllerName + "-controller get /checklist/:categoryID titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved " + tableName + "." });
      } else {
        // console.log(controllerName + "-controller get /checklist/:categoryID No Results");
        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });
      };
    })
    .catch((err) => {
      console.log(controllerName + "-controller get /checklist/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/* ******************************
 *** Add Title ***************
*********************************/
// * Allows an admin to add a new title
router.post("/", validateAdmin, (req, res) => {

  const recordObject = {
    titleName: req.body.title.titleName,
    titleSort: req.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: req.body.title.titleURL,
    authorFirstName: req.body.title.authorFirstName,
    authorLastName: req.body.title.authorLastName,
    publicationDate: req.body.title.publicationDate,
    imageName: req.body.title.imageName,
    categoryID: req.body.title.categoryID,
    shortDescription: req.body.title.shortDescription,
    urlPKDweb: req.body.title.urlPKDweb
  };

  db(tableName)
    .returning(select)
    .insert(recordObject)
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
 ******* Update Title *******
 ***************************/
// * Allows the admin to update the title including soft delete it
router.put("/:titleID", validateAdmin, (req, res) => {

  const recordObject = {
    titleName: req.body.title.titleName,
    titleSort: req.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: req.body.title.titleURL,
    authorFirstName: req.body.title.authorFirstName,
    authorLastName: req.body.title.authorLastName,
    publicationDate: req.body.title.publicationDate,
    imageName: req.body.title.imageName,
    categoryID: req.body.title.categoryID,
    shortDescription: req.body.title.shortDescription,
    urlPKDweb: req.body.title.urlPKDweb,
    active: req.body.title.active
  };

  const where = { titleID: req.params.titleID };

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
 ******* Delete Title *******
 ***************************/
// * Allows an admin to hard delete a title
router.delete("/:titleID", validateAdmin, (req, res) => {

  const where = { titleID: req.params.titleID };

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