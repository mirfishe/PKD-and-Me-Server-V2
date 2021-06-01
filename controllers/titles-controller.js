const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const isEmpty = require("../utilities/isEmpty");
const getDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const controllerName = "titles";
const tableName = "titles";
const select = "*";
const activeWhere = { "titles.active": true, /*"userReviews.active": true, "users.active": true,*/ "categories.active": true, "editions.active": true, "media.active": true };
const activeChecklist = { "titles.active": true, "userReviews.active": true, /*"users.active": true,*/ "categories.active": true };
const orderBy = [{ column: "titleSort", order: "asc" }];


// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createdAt, updatedAt
const columnsList = ["*", "titles.active AS titlesActive", "titles.createdAt AS titlesCreatedAt", "titles.updatedAt AS titlesUpdatedAt", "categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createdAt AS categoriesCreatedAt", "categories.updatedAt AS categoriesUpdatedAt"];

const checklistColumnsList = ["*", "titles.active AS titlesActive", "titles.createdAt AS titlesCreatedAt", "titles.updatedAt AS titlesUpdatedAt", "categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createdAt AS categoriesCreatedAt", "categories.updatedAt AS categoriesUpdatedAt", "userreviews.updatedBy AS userreviewsUpdatedBy", "userreviews.active AS userreviewsActive", "userreviews.createdAt AS userreviewsCreatedAt", "userreviews.updatedAt AS userreviewsUpdatedAt"];

/*
categories
("categoryID","category","categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createdAt AS categoriesCreatedAt", "categories.updatedAt AS categoriesUpdatedAt")

editions
("editionID", "titleID", "mediaID", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "ASIN", "textLinkShort", "textLinkFull", "imageLinkSmall", "imageLinkMedium", "imageLinkLarge", "textImageLink", "editions.active AS editionsActive", "editions.createdAt AS editionsCreatedAt", "editions.updatedAt AS editionsUpdatedAt")

media
("mediaID", "media", "electronic", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createdAt AS mediaCreatedAt", "media.updatedAt AS mediaUpdatedAt")

titles
("titleID", "titleName", "titleSort", "titleURL", "authorFirstName", "authorLastName", "titles.publicationDate AS titlesPublicationDate", "titles.imageName AS titlesImageName", "categoryID", "shortDescription", "urlPKDweb", "titles.active AS titlesActive", "titles.createdAt AS titlesCreatedAt", "titles.updatedAt AS titlesUpdatedAt")

userreviews
("reviewID", "userID", "userreviews.updatedBy AS userreviewsUpdatedBy", "titleID", "read", "dateRead", "rating", "shortReview", "longReview", "userreviews.active AS userreviewsActive", "userreviews.createdAt AS userreviewsCreatedAt", "userreviews.updatedAt AS userreviewsUpdatedAt")

users
("userID", "firstName", "lastName", "email", "password", "users.updatedBy AS usersUpdatedBy", "admin", "users.active AS usersActive", "users.createdAt AS usersCreatedAt", "users.updatedAt AS usersUpdatedAt")
*/


/******************************
 ***** Get Title List *********
 ******************************/
// * Returns all titles active or not
// * Just the title data and not the related tables data
router.get("/list", (req, res) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller get /list records", records);

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
 ***** Get Titles *********
 ******************************/
// ? ADD OVERALL RATING TO GET TITLE?
// router.get("/", (req, res) => {

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     // .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     // .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller get / records", records);

//         res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

//       } else {
//         // console.log(controllerName + "-controller get / No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller get / error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Title By TitleID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
// router.get("/:titleID", (req, res) => {

//   const where = { "titles.titleID": req.params.titleID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     // .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     // .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller get /:" + controllerName + "ID records", records);

//         // res.status(200).json({
//         // titleID:   title.titleID,
//         // titleName:     title.titleName,
//         // titleSort:  title.titleSort,
//         // authorFirstName:   title.authorFirstName,
//         // authorLastName:     title.authorLastName,
//         // publicationDate:  title.publicationDate,
//         // imageName:   title.imageName,
//         // categoryID:   title.categoryID,
//         // shortDescription:     title.shortDescription,
//         // urlPKDweb:  title.urlPKDweb,
//         // active:     title.active,
//         // message:    "Successfully retrieved " + tableName + "."
//         // });
//         res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

//       } else {
//         // console.log(controllerName + "-controller get /:" + controllerName + "ID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller get /:" + controllerName + "ID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


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
//     .then((records) => {
//         // console.log(controllerName + "-controller get /media/:mediaID" records", records);
//         res.status(200).json({records: records, message: "Successfully retrieved " + tableName + "."});
//     })
//         .catch((error) => {
//             console.log(controllerName + "-controller get /media/:mediaID error", error);
//             res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         });

// });


/**************************************
 ***** Get Titles By CategoryID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
// router.get("/category/:categoryID/:sort?", (req, res) => {

//   let orderByColumn = "titleSort";

//   if (req.params.sort == "publicationDate") {
//     orderByColumn = "publicationDate";
//   } else {
//     orderByColumn = "titleSort";
//   };

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": req.params.categoryID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     // .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     // .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderByDynamic)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller get /category/:categoryID records", records);

//         res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

//       } else {
//         // console.log(controllerName + "-controller get /category/:categoryID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller get /category/:categoryID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Titles By CategoryID Admin *****
***************************************/
// * Return all titles to adminster them
// router.get("/admin/category/:categoryID/:sort?", validateAdmin, (req, res) => {

//   let orderByColumn = "titleSort";

//   if (req.params.sort == "publicationDate") {
//     orderByColumn = "publicationDate";
//   } else {
//     orderByColumn = "titleSort";
//   };

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": req.params.categoryID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     // .where("titles.active", true)
//     .where("userReviews.active", true)
//     .where("users.active", true)
//     .where("categories.active", true)
//     // .where("editions.active", true)
//     // .where("media.active", true)
//     .orderBy(orderByDynamic)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller get /category/:categoryID records", records);

//         res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

//       } else {
//         // console.log(controllerName + "-controller get /category/:categoryID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller get /category/:categoryID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Titles/Checklist *****
***************************************/
router.get("/checklist/list", validateSession, (req, res) => {

  // SELECT * FROM titles LEFT OUTER JOIN userReviews on titles.titleID = userReviews.titleID
  // LEFT OUTER JOIN categories on categories.categoryID = titles.categoryID
  // WHERE titles.active = 1 AND categories.active = 1 AND (userReviews.active = 1 OR userReviews.active is null)
  // AND (userReviews.userID = 1 OR userReviews.userID is null)

  // let orderByColumn = "titleSort";
  let orderByDynamic;

  if (req.params.sort == "publicationDate") {
    // orderByColumn = "publicationDate";
    orderByDynamic = [{ column: "publicationDate", order: "asc" }, { column: "titleSort", order: "asc" }];
  } else {
    // orderByColumn = "titleSort";
    orderByDynamic = [{ column: "titleSort", order: "asc" }];
  };

  // const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(checklistColumnsList)
    .from(tableName)
    .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
    // .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    // .where("users.userID", req.user.userID)
    // .where("userReviews.userID", req.user.userID)
    .where(function () { this.where("userReviews.userID", req.user.userID).orWhereNull("userReviews.userID"); })
    // .where("userID", req.user.userID)
    // .where(activeChecklist)
    .where(function () { this.where("userReviews.active", 1).orWhereNull("userReviews.active"); })
    .where({ "titles.active": true, "categories.active": true })
    // .where("editions.active", true)
    // .where("media.active", true)
    .orderBy(orderByDynamic)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller get /checklist/list records", records);

        res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /checklist/list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller get /checklist/list error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/**************************************
 ***** Get Titles/Checklist By CategoryID *****
***************************************/
// router.get("/checklist/:categoryID/:sort?", validateSession, (req, res) => {

//   let orderByColumn = "titleSort";

//   if (req.params.sort == "publicationDate") {
//     orderByColumn = "publicationDate";
//   } else {
//     orderByColumn = "titleSort";
//   };

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": req.params.categoryID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where("users.userID", req.user.userID)
//     .where(activeChecklist)
//     // .where("editions.active", true)
//     // .where("media.active", true)
//     .orderBy(orderByDynamic)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller get /checklist/:categoryID records", records);
//         res.status(200).json({ records: records, resultsFound: true, message: "Successfully retrieved " + tableName + "." });
//       } else {
//         // console.log(controllerName + "-controller get /checklist/:categoryID No Results");
//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });
//       };
//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller get /checklist/:categoryID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


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
    // ! .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller post / records", records);

      // records = convertBitTrueFalse(records);

      recordObject.titleID = records;

      if (records.length > 0) {
        console.log(controllerName + "-controller post / records", records);

        res.status(200).json({ records: [recordObject], recordAdded: true, message: "Successfully created " + tableName + "." });

      } else {
        console.log(controllerName + "-controller post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: [recordObject], recordAdded: false, message: "Nothing to add." });

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
    // ! .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

      // records = convertBitTrueFalse(records);

      if (records.length > 0) {
        console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

        res.status(200).json({ records: [recordObject], recordUpdated: true, message: "Successfully updated " + tableName + "." });

      } else {
        console.log(controllerName + "-controller put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: [recordObject], recordUpdated: false, message: "Nothing to update." });

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
    // ! .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .del()
    .then((records) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

      // records = convertBitTrueFalse(records);

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