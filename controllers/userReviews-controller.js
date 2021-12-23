"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/appFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "userReviews";
const tableName = "userReviews";
// const select = "*";
// const activeWhere = { "titles.active": true, "userReviews.active": true, "users.active": true };
const orderBy = [{ column: "userReviews.updateDate", order: "desc" }];

// ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]
// ! Needs to not return the user's password. -- 06/01/2021 MF
// TODO: Needs to not return the user's password. -- 06/01/2021 MF
// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createDate, updateDate -- 06/01/2021 MF
// const columnsList = ["*", "titles.titleID", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "firstName", "lastName", "email", "users.updatedBy AS userUpdatedBy", "admin", "users.active AS userActive", "userReviews.updatedBy AS userReviewUpdatedBy", "userReviews.active AS userReviewActive", "userReviews.createDate AS userReviewCreateDate", "userReviews.updateDate AS userReviewUpdatedDate"];
const columnsList = ["userReviews.*", "titles.*", "titles.titleID", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "firstName", "users.updatedBy AS userUpdatedBy", "users.active AS userActive", "userReviews.updatedBy AS userReviewUpdatedBy", "userReviews.active AS userReviewActive", "userReviews.createDate AS userReviewCreateDate", "userReviews.updateDate AS userReviewUpdatedDate"];

/*
categories
("categoryID","category","categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createDate AS categoriesCreatedAt", "categories.updateDate AS categoriesUpdatedDate")

editions
("editionID", "titleID", "mediaID", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "ASIN", "textLinkShort", "textLinkFull", "imageLinkSmall", "imageLinkMedium", "imageLinkLarge", "textImageLink", "editions.active AS editionsActive", "editions.createDate AS editionsCreatedAt", "editions.updateDate AS editionsUpdatedDate")

media
("mediaID", "media", "electronic", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreatedAt", "media.updateDate AS mediaUpdatedDate")

titles
("titleID", "titleName", "titleSort", "titleURL", "authorFirstName", "authorLastName", "titles.publicationDate AS titlesPublicationDate", "titles.imageName AS titlesImageName", "categoryID", "shortDescription", "urlPKDWeb", "titles.active AS titlesActive", "titles.createDate AS titlesCreatedAt", "titles.updateDate AS titlesUpdatedDate")

userReviews
("reviewID", "userID", "userReviews.updatedBy AS userReviewsUpdatedBy", "titleID", "read", "dateRead", "rating", "shortReview", "longReview", "userReviews.active AS userReviewsActive", "userReviews.createDate AS userReviewsCreatedAt", "userReviews.updateDate AS userReviewsUpdatedDate")

users
("userID", "firstName", "lastName", "email", "password", "users.updatedBy AS usersUpdatedBy", "admin", "users.active AS usersActive", "users.createDate AS usersCreatedAt", "users.updateDate AS usersUpdatedDate")
*/


// ! Function doesn't work because it needs to wait on the results of the query -- 03/28/2021 MF
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

//             // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID/title/:titleID records", records);
//             // response.status(200).json({resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });
//             // console.log(`${controllerName}-controller`, GetDateTime(), "hasReviewedTitle", true);
//             return {hasReviewedTitle: true, resultsFound: true, message: `Successfully retrieved ${tableName}.`};

//         } else {

//             // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID/title/:titleID No Results");
//             // response.status(200).json({resultsFound: false, message: `No ${tableName} found.`});
//             // console.log(`${controllerName}-controller`, GetDateTime(), "hasReviewedTitle", false);
//             return {hasReviewedTitle: false, resultsFound: false, message: `No ${tableName} found.`};

//         };

//     })
//     .catch((error) => {
//         console.log(`${controllerName}-controller`, GetDateTime(), "hasReviewedTitle error", error);

//         // response.status(500).json({resultsFound: false, message: `No ${tableName} found.`, error: err});
//         return {hasReviewedTitle: false, resultsFound: false, message: "An error occurred.", error: err};

//     });

// };

let records;


/******************************
 ***** Get User Reviews *********
 ******************************/
// * Returns all user reviews active or not -- 06/01/2021 MF
// router.get("/list", (request, response) => {
router.get("/", (request, response) => {

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

        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);
        response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

        // response.status(200).send(`No ${tableName} found.`);
        // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

    });

});


/******************************
 ***** Get User Reviews *********
 ******************************/
// router.get("/", (request, response) => {

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
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get / error", error);

//       addErrorLog(`${controllerName}-controller`, "get /", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/**************************************
 ***** Get User Review By ReviewID *****
***************************************/
// router.get("/:reviewID", (request, response) => {

//   const where = { "userReviews.reviewID": request.params.reviewID };

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
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID records`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });
//         // response.status(200).json({
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
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(`${controllerName}-controller`, `get /:${controllerName}ID`, records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/**************************************
 ***** Get Total Average Rating By TitleID *****
***************************************/
// * Gets the overall rating for the title -- 03/28/2021 MF
// router.get("/rating/:titleID", (request, response) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: request.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((userReview) => response.status(200).json({
//         titleID:    userReview.titleID,
//         overallRating:     userReview.overallRating,
//         message:    "Successfully retrieved user overall rating."
//         }))
//         .catch((error) => {
//             console.log(`${controllerName}-controller`, GetDateTime(), "get /rating/:titleID error", error);

//             addErrorLog(`${controllerName}-controller`, "get /rating/:titleID", records, error);
//             response.status(500).json({resultsFound: false, message: `No ${tableName} found.`, error: err});

//         });

// });


/**************************************
 ***** Get User Review Count Rating By TitleID *****
***************************************/
// * Gets the user review count for the title -- 03/28/2021 MF
// * Don't need because the count comes back with the get user reviews by titleID -- 03/28/2021 MF
// router.get("/count/:titleID", (request, response) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: request.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.count(query)
//     .then((userReview) => {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /count/:titleID userReview", userReview);
//         response.status(200).json({
//         userReviewCount:    userReview,
//         message:    "Successfully retrieved user review count."});
//     })
//     .catch((error) => {
//         console.log(`${controllerName}-controller`, GetDateTime(), "get /count/:titleID error", error);

//         addErrorLog(`${controllerName}-controller`, "get /count/:titleID", records, error);
//         response.status(500).json({resultsFound: false, message: `No ${tableName} found.`, error: err});

//     });

// });


/**************************************
 ***** Get User Review Rating Sum By TitleID *****
***************************************/
// * Gets the sum of ratings for the title -- 03/28/2021 MF
// * Don't need since the rating endpoint is working -- 03/28/2021 MF
// router.get("/sum/:titleID", (request, response) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: request.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.sum("rating", query)
//     .then((userRatingSum) => {

//         if (!isNaN(userRatingSum)) {
//             // console.log(`${controllerName}-controller`, GetDateTime(), "get /sum/:titleID userRatingSum", userRatingSum);

//             response.status(200).json({
//                 userRatingSum:    userRatingSum,
//                 resultsFound: true,
//                 message:    "Successfully retrieved user review sum."
//             });

//         } else {
//             // console.log(`${controllerName}-controller`, GetDateTime(), "get /sum/:titleID userRatingSum", userRatingSum);

//             // response.status(200).json({resultsFound: false, message: "There are no user ratings."});
//             response.status(200).json({
//                 userRatingSum:    0,
//                 // resultsFound: true,
//                 resultsFound: false,
//                 message:    "There are no user ratings."
//             });

//         };
//     })
//     .catch((error) => {
//         console.log(`${controllerName}-controller`, GetDateTime(), "get /sum/:titleID error", error);

//         addErrorLog(`${controllerName}-controller`, "get /sum/:titleID", records, error);
//         response.status(500).json({resultsFound: false, message: "Did not successfully retrieved user review sum.", error: err});

//     });

// });


/**************************************
 ***** Get User Review Ratings *****
***************************************/
// * Gets the sum and count of ratings for the title -- 03/28/2021 MF
// router.get("/rating/list", (request, response) => {
router.get("/rating", (request, response) => {

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

  // * .replace() and .replaceAll() are not working -- 05/08/2021 MF
  // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

  // select titleID, count(rating) as userReviewCount, sum(rating) as userReviewSum from userReviews where active = ? and rating is not null and not rating = ? group by titleID

  // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

  // let sqlQuery = db.select("titleID")
  //   .from(tableName)
  //   .count("rating", { as: "userReviewCount" })
  //   .sum({ userReviewSum: "rating" })
  //   .where({ active: true })
  //   .whereNotNull("rating")
  //   .whereNot({ rating: 0 })
  //   .groupBy("titleID").toString();

  // console.log(`${controllerName}-controller`, GetDateTime(), "get /rating sqlQuery", sqlQuery);

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
        // console.log(`${controllerName}-controller`, GetDateTime(), "get /rating records", records);

        response.status(200).json({ resultsFound: true, message: "Successfully retrieved user ratings.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "get /rating  No Results");

        // response.status(200).send(`No ${tableName} found.`);
        // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        response.status(200).json({ resultsFound: false, message: "No user ratings found." });

      };
    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get /rating error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ resultsFound: false, message: "No user ratings found.", error: error });

    });

});


/**************************************
 ***** Get User Review Rating By TitleID *****
***************************************/
// * Gets the sum and count of ratings for the title -- 03/28/2021 MF
// router.get("/rating/:titleID", (request, response) => {

//   // let sqlQuery = db.select("titleID")
//   //   .from(tableName)
//   //   .count("rating", { as: "userReviewCount" })
//   //   .sum({ userReviewSum: "rating" })
//   //   .where({ titleID: request.params.titleID })
//   //   .where({ active: true })
//   //   .whereNotNull("rating")
//   //   .whereNot({ rating: 0 })
//   //   .groupBy("titleID")
//   //   .toSQL();
//   // // .toString();

//   // * .replace() and .replaceAll() are not working -- 05/24/2021 MF
//   // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

//   // select titleID, count(rating) as userReviewCount, sum(rating) as userReviewSum from userReviews where titleID = ? and active = ? and rating is not null and not rating = ? group by titleID

//   // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

//   const where = { "userReviews.titleID": request.params.titleID };

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
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /rating/:titleID records", records);

//         response.status(200).json({ resultsFound: true, message: "Successfully retrieved user ratings.", records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /rating/:titleID  No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: "No user ratings found." });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /rating/:titleID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /rating/:titleID", records, error);
//       response.status(500).json({ resultsFound: false, message: "No user ratings found.", error: error });

//     });

// });


/**************************************
 ***** Get User Reviews By TitleID *****
***************************************/
// * Gets all user reviews by TitleID and the count -- 03/28/2021 MF
// TODO: Would like to add the overall rating for the title -- 03/28/2021 MF
// router.get("/title/:titleID", (request, response) => {

//   const where = { "userReviews.titleID": request.params.titleID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {
//       // console.log(`${controllerName}-controller`, GetDateTime(), "get /title/:titleID records", records);

//       records = convertBitTrueFalse(records);

//       // if (records.rows.length > 0) {
//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /title/:titleID records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /title/:titleID No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /title/:titleID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /title/:titleID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/**************************************
 ***** Get User Reviews By UserID *****
***************************************/
// router.get("/user/:userID", (request, response) => {

//   const where = { "userReviews.userID": request.params.userID };

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
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID" records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /user/:userID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/**************************************
 ***** Get User Reviews By UserID and TitleID *****
***************************************/
// * Don't need because the front end restricts user reviews to one per title -- 03/28/2021 MF
// router.get("/user/:userID/title/:titleID", (request, response) => {

//   const where = { "userReviews.titleID": request.params.titleID, "userReviews.userID": request.params.userID };

//   // ! Function doesn't work because it needs to wait on the results of the query -- 05/24/2021 MF
//   // console.log("hasReviewedTitle", hasReviewedTitle(request.params.userID, request.params.titleID));

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
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID/title/:titleID records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID/title/:titleID No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /user/:userID/title/:titleID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /user/:userID/title/:titleID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

//     });

// });


/* ******************************
 *** Add User Review  ***************
*********************************/
// * Allows a user to add a new user review -- 03/28/2021 MF
router.post("/", validateSession, (request, response) => {

  const recordObject = {
    userID: request.user.userID,
    updatedBy: request.user.userID,
    titleID: request.body.userReview.titleID,
    read: request.body.userReview.read,
    dateRead: request.body.userReview.dateRead,
    rating: request.body.userReview.rating,
    ranking: request.body.userReview.ranking,
    shortReview: request.body.userReview.shortReview,
    longReview: request.body.userReview.longReview,
    owned: request.body.userReview.owned,
    datePurchased: request.body.userReview.datePurchased,
    active: true
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      recordObject.reviewID = records[0];

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);

        response.status(200).json({ recordAdded: true, message: `Successfully created ${tableName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), "post / No Results");

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ recordAdded: false, message: `Not successfully created ${tableName}.`, error: error });

    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
// * Allows the user to update the user review including soft delete it -- 03/28/2021 MF
router.put("/:reviewID", validateSession, (request, response) => {

  const recordObject = {
    userID: request.user.userID,
    updatedBy: request.user.userID,
    titleID: request.body.userReview.titleID,
    read: request.body.userReview.read,
    dateRead: request.body.userReview.dateRead,
    rating: request.body.userReview.rating,
    ranking: request.body.userReview.ranking,
    shortReview: request.body.userReview.shortReview,
    longReview: request.body.userReview.longReview,
    owned: request.body.userReview.owned,
    datePurchased: request.body.userReview.datePurchased,
    active: request.body.userReview.active
  };

  const where = { reviewID: request.params.reviewID, userID: request.user.userID };

  // let sqlQuery = db(tableName)
  //   .where(where)
  //   // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
  //   // .returning(select)
  //   .update(recordObject).toString();

  // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID sqlQuery`, sqlQuery);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID records`, records);

        response.status(200).json({ recordUpdated: true, message: `Successfully updated ${tableName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordUpdated: false, message: "Nothing to update.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `put /:${controllerName}ID`, records, error);
      response.status(500).json({ recordUpdated: false, message: `Not successfully updated ${tableName}.`, error: error });

    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
// * Allows the admin to update the user review including soft delete it -- 03/28/2021 MF
router.put("/admin/:reviewID", validateAdmin, (request, response) => {

  const recordObject = {
    userID: request.body.userReview.userID,
    updatedBy: request.user.userID,
    titleID: request.body.userReview.titleID,
    read: request.body.userReview.read,
    dateRead: request.body.userReview.dateRead,
    rating: request.body.userReview.rating,
    ranking: request.body.userReview.ranking,
    shortReview: request.body.userReview.shortReview,
    longReview: request.body.userReview.longReview,
    owned: request.body.userReview.owned,
    datePurchased: request.body.userReview.datePurchased,
    active: request.body.userReview.active
  };

  const where = { reviewID: request.params.reviewID };

  // let sqlQuery = db(tableName)
  //   .where(where)
  //   // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
  //   // .returning(select)
  //   .update(recordObject).toString();

  // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID sqlQuery`, sqlQuery);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID records`, records);

        response.status(200).json({ recordUpdated: true, message: `Successfully updated ${tableName}.`, records: [recordObject] });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordUpdated: false, message: "Nothing to update.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `put /:${controllerName}ID`, records, error);
      response.status(500).json({ recordUpdated: false, message: `Not successfully updated ${tableName}.`, error: error });

    });

});


/***************************
 ******* Delete User Review *******
 ***************************/
// * Allows an admin to hard delete a review -- 03/28/2021 MF
router.delete("/:reviewID", validateAdmin, (request, response) => {

  const where = { reviewID: request.params.reviewID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ recordDeleted: true, message: `Successfully deleted ${tableName}.`, reviewID: request.params.reviewID });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordDeleted: false, message: "Nothing to delete.", reviewID: request.params.reviewID });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `delete /:${controllerName}ID`, records, error);
      response.status(500).json({ recordDeleted: false, message: `Not successfully deleted ${tableName}.`, error: error });

    });

});


module.exports = router;