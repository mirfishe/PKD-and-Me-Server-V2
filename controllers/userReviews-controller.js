const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const controllerName = "userReviews";
const tableName = "userReviews";
const select = "*";
const activeWhere = { "titles.active": true, "userReviews.active": true, "users.active": true };
const orderBy = [{ column: "userReviews.updateDate", order: "desc" }];

// ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]
// ! Needs to not return the user's password.
// TODO: Needs to not return the user's password.
// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createDate, updateDate
const columnsList = ["*", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "firstName", "lastName", "email", "users.updatedBy AS userUpdatedBy", "admin", "users.active AS userActive", "userReviews.updatedBy AS userReviewUpdatedBy", "userReviews.active AS userReviewActive", "userReviews.createDate AS userReviewCreateDate", "userReviews.updateDate AS userReviewUpdatedDate"];

/*
categories
("categoryID","category","categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createDate AS categoriesCreatedAt", "categories.updateDate AS categoriesUpdatedDate")

editions
("editionID", "titleID", "mediaID", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "ASIN", "textLinkShort", "textLinkFull", "imageLinkSmall", "imageLinkMedium", "imageLinkLarge", "textImageLink", "editions.active AS editionsActive", "editions.createDate AS editionsCreatedAt", "editions.updateDate AS editionsUpdatedDate")

media
("mediaID", "media", "electronic", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreatedAt", "media.updateDate AS mediaUpdatedDate")

titles
("titleID", "titleName", "titleSort", "titleURL", "authorFirstName", "authorLastName", "titles.publicationDate AS titlesPublicationDate", "titles.imageName AS titlesImageName", "categoryID", "shortDescription", "urlPKDweb", "titles.active AS titlesActive", "titles.createDate AS titlesCreatedAt", "titles.updateDate AS titlesUpdatedDate")

userReviews
("reviewID", "userID", "userReviews.updatedBy AS userReviewsUpdatedBy", "titleID", "read", "dateRead", "rating", "shortReview", "longReview", "userReviews.active AS userReviewsActive", "userReviews.createDate AS userReviewsCreatedAt", "userReviews.updateDate AS userReviewsUpdatedDate")

users
("userID", "firstName", "lastName", "email", "password", "users.updatedBy AS usersUpdatedBy", "admin", "users.active AS usersActive", "users.createDate AS usersCreatedAt", "users.updateDate AS usersUpdatedDate")
*/


// ! Function doesn't work because it needs to wait on the results of the query
// function hasReviewedTitle (userID, titleID) {

//     const query = {where: {
//         [Op.and]: [
//         {userID: {[Op.eq]: userID}},
//         {titleID: {[Op.eq]: titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((records) => {
//         if (records.length > 0) {
//             // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID/title/:titleID records", records);
//             // res.status(200).json({resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });
//             // console.log(controllerName + "-controller", GetDateTime(), " hasReviewedTitle", true);
//             return {hasReviewedTitle: true, resultsFound: true, message: "Successfully retrieved " + tableName + "."};
//         } else {
//             // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID/title/:titleID No Results");
//             // res.status(200).json({resultsFound: false, message: "No " + tableName + " found."});
//             // console.log(controllerName + "-controller", GetDateTime(), " hasReviewedTitle", false);
//             return {hasReviewedTitle: false, resultsFound: false, message: "No " + tableName + " found."};
//         };
//     })
//     .catch((error) => {
//         console.log(controllerName + "-controller", GetDateTime(), " hasReviewedTitle error", error);
//         // res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         return {hasReviewedTitle: false, resultsFound: false, message: "An error occurred.", error: err};
//     });

// };


/******************************
 ***** Get User Reviews *********
 ******************************/
// * Returns all user reviews active or not
// router.get("/list", (req, res) => {
router.get("/", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    // .where("titles.active", true)
    // .where("userReviews.active", true)
    // .where("users.active", true)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {

        // console.log(controllerName + "-controller", GetDateTime(), " get /list records", records);
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
 ***** Get User Reviews *********
 ******************************/
// router.get("/", (req, res) => {

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get / records", records);

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


/**************************************
 ***** Get User Review By ReviewID *****
***************************************/
// router.get("/:reviewID", (req, res) => {

//   const where = { "userReviews.reviewID": req.params.reviewID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });
//         // res.status(200).json({
//         // reviewID:   userReview.reviewID,
//         // userID:     userReview.userID,
//         // updatedBy:  userReview.updatedBy,
//         // titleID:    userReview.titleID,
//         // read:       userReview.read,
//         // dateRead:   userReview.dateRead,
//         // rating:     userReview.rating,
//         // shortReview:   userReview.shortReview,
//         // longReview:   userReview.longReview,
//         // active:     userReview.active,
//         // message:    "Successfully retrieved user review information."
//         // });

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


/**************************************
 ***** Get Total Average Rating By TitleID *****
***************************************/
// * Gets the overall rating for the title
// router.get("/rating/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((userReview) => res.status(200).json({
//         titleID:    userReview.titleID,
//         overallRating:     userReview.overallRating,
//         message:    "Successfully retrieved user overall rating."
//         }))
//         .catch((error) => {
//             console.log(controllerName + "-controller", GetDateTime(), " get /rating/:titleID error", error);
//             res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         });

// });


/**************************************
 ***** Get User Review Count Rating By TitleID *****
***************************************/
// * Gets the user review count for the title
// * Don't need because the count comes back with the get user reviews by titleID
// router.get("/count/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.count(query)
//     .then((userReview) => {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /count/:titleID userReview", userReview);
//         res.status(200).json({
//         userReviewCount:    userReview,
//         message:    "Successfully retrieved user review count."});
//     })
//     .catch((error) => {
//         console.log(controllerName + "-controller", GetDateTime(), " get /count/:titleID error", error);
//         res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//     });

// });


/**************************************
 ***** Get User Review Rating Sum By TitleID *****
***************************************/
// * Gets the sum of ratings for the title
// * Don't need since the rating endpoint is working
// router.get("/sum/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.sum("rating", query)
//     .then((userRatingSum) => {
//         if (!isNaN(userRatingSum)) {
//             // console.log(controllerName + "-controller", GetDateTime(), " get /sum/:titleID userRatingSum", userRatingSum);
//             res.status(200).json({
//                 userRatingSum:    userRatingSum,
//                 resultsFound: true,
//                 message:    "Successfully retrieved user review sum."
//             });
//         } else {
//             // console.log(controllerName + "-controller", GetDateTime(), " get /sum/:titleID userRatingSum", userRatingSum);
//             // res.status(200).json({resultsFound: false, message: "There are no user ratings."});
//             res.status(200).json({
//                 userRatingSum:    0,
//                 // resultsFound: true,
//                 resultsFound: false,
//                 message:    "There are no user ratings."
//             });
//         };
//     })
//     .catch((error) => {
//         console.log(controllerName + "-controller", GetDateTime(), " get /sum/:titleID error", error);
//         res.status(500).json({resultsFound: false, message: "Did not successfully retrieved user review sum.", error: err});
//     });

// });


/**************************************
 ***** Get User Review Ratings *****
***************************************/
// * Gets the sum and count of ratings for the title
// router.get("/rating/list", (req, res) => {
router.get("/rating", (req, res) => {

  // let sqlQuery = db.select("titleID")
  //   .from(tableName)
  //   .count("rating", { as: "userReviewCount" })
  //   .sum({ userReviewSum: "rating" })
  //   .where({ active: true })
  //   .whereNotNull("rating")
  //   .whereNot({ rating: 0 })
  //   .groupBy("titleID")
  //   .toSQL();
  // // .toString();

  // * .replace() and .replaceAll() are not working
  // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

  // select titleID, count(rating) as userReviewCount, sum(rating) as userReviewSum from userReviews where active = ? and rating is not null and not rating = ? group by titleID

  // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, sqlQuery);

  db.select("titleID")
    .from(tableName)
    .count("rating", { as: "userReviewCount" })
    .sum({ userReviewSum: "rating" })
    .where({ active: true })
    .whereNotNull("rating")
    .whereNot({ rating: 0 })
    .groupBy("titleID")
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " get /rating records", records);

        res.status(200).json({ resultsFound: true, message: "Successfully retrieved user ratings.", records: records });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " get /rating  No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No user ratings found." });

      };
    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " get /rating error", error);
      res.status(500).json({ resultsFound: false, message: "No user ratings found.", error: error });
    });

});


/**************************************
 ***** Get User Review Rating By TitleID *****
***************************************/
// * Gets the sum and count of ratings for the title
// router.get("/rating/:titleID", (req, res) => {

//   // let sqlQuery = db.select("titleID")
//   //   .from(tableName)
//   //   .count("rating", { as: "userReviewCount" })
//   //   .sum({ userReviewSum: "rating" })
//   //   .where({ titleID: req.params.titleID })
//   //   .where({ active: true })
//   //   .whereNotNull("rating")
//   //   .whereNot({ rating: 0 })
//   //   .groupBy("titleID")
//   //   .toSQL();
//   // // .toString();

//   // * .replace() and .replaceAll() are not working
//   // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

//   // select titleID, count(rating) as userReviewCount, sum(rating) as userReviewSum from userReviews where titleID = ? and active = ? and rating is not null and not rating = ? group by titleID

//   // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, sqlQuery);

//   const where = { "userReviews.titleID": req.params.titleID };

//   db.select("titleID")
//     .from(tableName)
//     .count("rating", { as: "userReviewCount" })
//     .sum({ userReviewSum: "rating" })
//     .where(where)
//     .where({ active: true })
//     .whereNotNull("rating")
//     .whereNot({ rating: 0 })
//     .groupBy("titleID")
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /rating/:titleID records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved user ratings.", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /rating/:titleID  No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No user ratings found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /rating/:titleID error", error);
//       res.status(500).json({ resultsFound: false, message: "No user ratings found.", error: error });
//     });

// });


/**************************************
 ***** Get User Reviews By TitleID *****
***************************************/
// * Gets all user reviews by TitleID and the count
// TODO: Would like to add the overall rating for the title
// router.get("/title/:titleID", (req, res) => {

//   const where = { "userReviews.titleID": req.params.titleID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {
//       // console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID records", records);

//       records = convertBitTrueFalse(records);

//       // if (records.rows.length > 0) {
//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get User Reviews By UserID *****
***************************************/
// router.get("/user/:userID", (req, res) => {

//   const where = { "userReviews.userID": req.params.userID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID" records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get User Reviews By UserID and TitleID *****
***************************************/
// * Don't need because the front end restricts user reviews to one per title
// router.get("/user/:userID/title/:titleID", (req, res) => {

//   const where = { "userReviews.titleID": req.params.titleID, "userReviews.userID": req.params.userID };

//   // ! Function doesn't work because it needs to wait on the results of the query
//   // console.log("hasReviewedTitle", hasReviewedTitle(req.params.userID, req.params.titleID));

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID/title/:titleID records", records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID/title/:titleID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /user/:userID/title/:titleID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/* ******************************
 *** Add User Review  ***************
*********************************/
// * Allows a user to add a new user review
router.post("/", validateSession, (req, res) => {

  const recordObject = {
    userID: req.user.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    ranking: req.body.userReview.ranking,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
      // * Returns the ID value of the added record.

      // records = convertBitTrueFalse(records);

      recordObject.reviewID = records;

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
 ******* Update User Review  *******
 ***************************/
// * Allows the user to update the user review including soft delete it
router.put("/:reviewID", validateSession, (req, res) => {

  const recordObject = {
    userID: req.user.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    ranking: req.body.userReview.ranking,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview,
    active: req.body.userReview.active
  };

  const where = { reviewID: req.params.reviewID, userID: req.user.userID };

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
 ******* Update User Review  *******
 ***************************/
// * Allows the admin to update the user review including soft delete it
router.put("/admin/:reviewID", validateAdmin, (req, res) => {

  const recordObject = {
    userID: req.body.userReview.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    ranking: req.body.userReview.ranking,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview,
    active: req.body.userReview.active
  };

  const where = { reviewID: req.params.reviewID };

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
 ******* Delete User Review *******
 ***************************/
// * Allows an admin to hard delete a review
router.delete("/:reviewID", validateAdmin, (req, res) => {

  const where = { reviewID: req.params.reviewID };

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

        res.status(200).json({ recordDeleted: true, message: "Successfully deleted " + tableName + ".", reviewID: req.params.reviewID });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordDeleted: false, message: "Nothing to delete.", reviewID: req.params.reviewID });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;