"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const { isEmpty, getDateTime, isNonEmptyArray, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

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
// const hasReviewedTitle = (userID, titleID) => {

//     let query = {where: {
//         [Op.and]: [
//         {userID: {[Op.eq]: userID}},
//         {titleID: {[Op.eq]: titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//             return {hasReviewedTitle: true, transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records."};

//         } else {

//             return {hasReviewedTitle: false, transactionSuccess: false, errorOccurred: false, message: `No ${tableName} found.`};

//         };

//     })
//     .catch((error) => {

//         console.error(componentName, getDateTime(), "hasReviewedTitle error", error);

//         return {hasReviewedTitle: false, transactionSuccess: false, errorOccurred: true, message: "An error occurred.", error: err};

//     });

// };

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get User Reviews *********
 ******************************/
router.get("/", (request, response) => {

  // * ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    // .where("titles.active", true)
    // .where("userReviews.active", true)
    // .where("users.active", true)
    .orderBy(orderBy)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get / error", error);

      addErrorLog(componentName, "get /", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get / error", error);

//       addErrorLog(componentName, "get /", {}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get User Review By ReviewID *****
***************************************/
// router.get("/:reviewID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let reviewID = isEmpty(request.params.reviewID) === false ? request.params.reviewID : "";

// if (isNaN(formatTrim(reviewID)) === true) {

//   reviewID = 0;

// } else {

//   reviewID = parseInt(reviewID);

// };

// let where = { "userReviews.reviewID": reviewID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });
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

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(componentName, `get /:${controllerName}ID`, {"reviewID": reviewID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Total Average Rating By TitleID *****
***************************************/
// router.get("/rating/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

//     let query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: titleID}},
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

//             console.error(componentName, getDateTime(), "get /rating/:titleID error", error);

//             addErrorLog(componentName, "get /rating/:titleID", {"titleID": titleID}, error);
//             response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//         });

// });


/**************************************
 ***** Get User Review Count Rating By TitleID *****
***************************************/
// * Don't need because the count comes back with the get user reviews by titleID -- 03/28/2021 MF
// router.get("/count/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

//     let query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.count(query)
//     .then((userReview) => {
//         response.status(200).json({
//         userReviewCount:    userReview,
//         message:    "Successfully retrieved user review count."});
//     })
//     .catch((error) => {

//         console.error(componentName, getDateTime(), "get /count/:titleID error", error);

//         addErrorLog(componentName, "get /count/:titleID", {"titleID": titleID}, error);
//         response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get User Review Rating Sum By TitleID *****
***************************************/
// * Don't need since the rating endpoint is working -- 03/28/2021 MF
// router.get("/sum/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

//     let query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.sum("rating", query)
//     .then((userRatingSum) => {

//         if (isNaN(userRatingSum) === false) {

//             response.status(200).json({ transactionSuccess: true, errorOccurred: false, userRatingSum: userRatingSum, message: "Successfully retrieved user review sum." });

//         } else {

//             response.status(200).json({ transactionSuccess: false, errorOccurred: false, userRatingSum: 0, message: "There are no user ratings." });

//         };
//     })
//     .catch((error) => {

//         console.error(componentName, getDateTime(), "get /sum/:titleID error", error);

//         addErrorLog(componentName, "get /sum/:titleID", {"titleID": titleID}, error);
//         response.status(500).json({transactionSuccess: false, errorOccurred: true, message: "Did not successfully retrieved user review sum.", error: err});

//     });

// });


/**************************************
 ***** Get User Review Ratings *****
***************************************/
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

  // let sqlQuery = db.select("titleID")
  //   .from(tableName)
  //   .count("rating", { as: "userReviewCount" })
  //   .sum({ userReviewSum: "rating" })
  //   .where({ active: true })
  //   .whereNotNull("rating")
  //   .whereNot({ rating: 0 })
  //   .groupBy("titleID").toString();

  db.select("titleID")
    .from(tableName)
    .count("rating", { as: "userReviewCount" })
    .sum({ userReviewSum: "rating" })
    .where({ active: true })
    .whereNotNull("rating")
    .whereNot({ rating: 0 })
    .groupBy("titleID")
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved user ratings.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "No user ratings found." });

      };
    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /rating error", error);

      addErrorLog(componentName, "get /rating", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No user ratings found.", error: error });

    });

});


/**************************************
 ***** Get User Review Rating By TitleID *****
***************************************/
// router.get("/rating/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

//   // let sqlQuery = db.select("titleID")
//   //   .from(tableName)
//   //   .count("rating", { as: "userReviewCount" })
//   //   .sum({ userReviewSum: "rating" })
//   //   .where({ titleID: titleID })
//   //   .where({ active: true })
//   //   .whereNotNull("rating")
//   //   .whereNot({ rating: 0 })
//   //   .groupBy("titleID")
//   //   .toSQL();
//   // // .toString();

//   // * .replace() and .replaceAll() are not working -- 05/24/2021 MF
//   // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

//   // select titleID, count(rating) as userReviewCount, sum(rating) as userReviewSum from userReviews where titleID = ? and active = ? and rating is not null and not rating = ? group by titleID

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

// let where = { "userReviews.titleID": titleID };

//   db.select("titleID")
//     .from(tableName)
//     .count("rating", { as: "userReviewCount" })
//     .sum({ userReviewSum: "rating" })
//     .where(where)
//     .where({ active: true })
//     .whereNotNull("rating")
//     .whereNot({ rating: 0 })
//     .groupBy("titleID")
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved user ratings.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "No user ratings found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /rating/:titleID error", error);

//       addErrorLog(componentName, "get /rating/:titleID", {"titleID": titleID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No user ratings found.", error: error });

//     });

// });


/**************************************
 ***** Get User Reviews By TitleID *****
***************************************/
// TODO: Would like to add the overall rating for the title -- 03/28/2021 MF
// router.get("/title/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

// let where = { "userReviews.titleID": titleID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       // if (records.rows.length > 0) {
//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /title/:titleID error", error);

//       addErrorLog(componentName, "get /title/:titleID", {"titleID": titleID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get User Reviews By UserID *****
***************************************/
// router.get("/user/:userID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let userID = isEmpty(request.params.userID) === false ? request.params.userID : "";

// if (isNaN(formatTrim(userID)) === true) {

//   userID = 0;

// } else {

//   userID = parseInt(userID);

// };

// let where = { "userReviews.userID": userID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "userReviews.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /user/:userID error", error);

//       addErrorLog(componentName, "get /user/:userID", {"userID": userID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get User Reviews By UserID and TitleID *****
***************************************/
// * Don't need because the front end restricts user reviews to one per title -- 03/28/2021 MF
// router.get("/user/:userID/title/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

// let userID = isEmpty(request.params.userID) === false ? request.params.userID : "";

// if (isNaN(formatTrim(userID)) === true) {

//   userID = 0;

// } else {

//   userID = parseInt(userID);

// };

//   let where = { "userReviews.titleID": titleID, "userReviews.userID": userID };

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /user/:userID/title/:titleID error", error);

//       addErrorLog(componentName, "get /user/:userID/title/:titleID", { userID: userID, titleID: titleID }, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add User Review  ***************
*********************************/
router.post("/", validateSession, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  let recordObject = {
    userID: userID,
    updatedBy: userID,
    titleID: request.body.recordObject.titleID,
    read: request.body.recordObject.read,
    dateRead: request.body.recordObject.dateRead,
    rating: request.body.recordObject.rating,
    ranking: request.body.recordObject.ranking,
    shortReview: request.body.recordObject.shortReview,
    longReview: request.body.recordObject.longReview,
    owned: request.body.recordObject.owned,
    datePurchased: request.body.recordObject.datePurchased,
    active: true
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      addErrorLog(componentName, "post /", { requestUser: request.user, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
router.put("/:reviewID", validateSession, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };


  let recordObject = {
    userID: userID,
    updatedBy: userID,
    titleID: request.body.recordObject.titleID,
    read: request.body.recordObject.read,
    dateRead: request.body.recordObject.dateRead,
    rating: request.body.recordObject.rating,
    ranking: request.body.recordObject.ranking,
    shortReview: request.body.recordObject.shortReview,
    longReview: request.body.recordObject.longReview,
    owned: request.body.recordObject.owned,
    datePurchased: request.body.recordObject.datePurchased,
    active: request.body.recordObject.active
  };

  let reviewID = isEmpty(request.params.reviewID) === false ? request.params.reviewID : "";

  if (isNaN(formatTrim(reviewID)) === true) {

    reviewID = 0;

  } else {

    reviewID = parseInt(reviewID);

  };

  let where = { reviewID: reviewID, userID: userID };

  // let sqlQuery = db(tableName)
  //   .where(where)
  //   // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
  //   // .returning(select)
  //   .update(recordObject).toString();

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(componentName, `put /:${controllerName}ID`, { reviewID: request.params.reviewID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
router.put("/admin/:reviewID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  let recordObject = {
    userID: request.body.recordObject.userID,
    updatedBy: userID,
    titleID: request.body.recordObject.titleID,
    read: request.body.recordObject.read,
    dateRead: request.body.recordObject.dateRead,
    rating: request.body.recordObject.rating,
    ranking: request.body.recordObject.ranking,
    shortReview: request.body.recordObject.shortReview,
    longReview: request.body.recordObject.longReview,
    owned: request.body.recordObject.owned,
    datePurchased: request.body.recordObject.datePurchased,
    active: request.body.recordObject.active
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let reviewID = isEmpty(request.params.reviewID) === false ? request.params.reviewID : "";

  if (isNaN(formatTrim(reviewID)) === true) {

    reviewID = 0;

  } else {

    reviewID = parseInt(reviewID);

  };

  let where = { reviewID: reviewID };

  // let sqlQuery = db(tableName)
  //   .where(where)
  //   // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
  //   // .returning(select)
  //   .update(recordObject).toString();

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(componentName, `put /:${controllerName}ID`, { reviewID: request.params.reviewID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Delete User Review *******
 ***************************/
router.delete("/:reviewID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let reviewID = isEmpty(request.params.reviewID) === false ? request.params.reviewID : "";

  if (isNaN(formatTrim(reviewID)) === true) {

    reviewID = 0;

  } else {

    reviewID = parseInt(reviewID);

  };

  let where = { reviewID: reviewID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.reviewID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(componentName, `delete /:${controllerName}ID`, { reviewID: reviewID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;