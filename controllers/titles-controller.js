"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, isNonEmptyArray, formatLowerCase, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "titles";
const tableName = "titles";
const select = "*";
// const activeWhere = { "titles.active": true, /* "userReviews.active": true, "users.active": true, */ "categories.active": true, "editions.active": true, "media.active": true };
// const activeChecklist = { "titles.active": true, "userReviews.active": true, /* "users.active": true, */ "categories.active": true };
const orderBy = [{ column: "titleSort", order: "asc" }];


// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createDate, updateDate -- 06/01/2021 MF
const columnsList = ["*", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "categories.sortID AS categorySortID", "categories.active AS categoryActive", "categories.createDate AS categoryCreateDate", "categories.updateDate AS categoryUpdatedDate"];

// const checklistColumnsList = ["*", "titles.titleID", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "categories.sortID AS categorySortID", "categories.active AS categoryActive", "categories.createDate AS categoryCreateDate", "categories.updateDate AS categoryUpdatedDate", "userReviews.updatedBy AS userReviewUpdatedBy", "userReviews.active AS userReviewActive", "userReviews.createDate AS userReviewCreateDate", "userReviews.updateDate AS userReviewUpdatedDate"];

/*
categories
("categoryID","category","categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createDate AS categoriesCreateDate", "categories.updateDate AS categoriesUpdatedDate")

editions
("editionID", "titleID", "mediaID", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "ASIN", "textLinkShort", "textLinkFull", "imageLinkSmall", "imageLinkMedium", "imageLinkLarge", "textImageLink", "editions.active AS editionsActive", "editions.createDate AS editionsCreateDate", "editions.updateDate AS editionsUpdatedDate")

media
("mediaID", "media", "electronic", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreateDate", "media.updateDate AS mediaUpdatedDate")

titles
("titleID", "titleName", "titleSort", "titleURL", "authorFirstName", "authorLastName", "titles.publicationDate AS titlesPublicationDate", "titles.imageName AS titlesImageName", "categoryID", "shortDescription", "urlPKDWeb", "titles.active AS titlesActive", "titles.createDate AS titlesCreateDate", "titles.updateDate AS titlesUpdatedDate")

userReviews
("reviewID", "userID", "userReviews.updatedBy AS userReviewsUpdatedBy", "titleID", "read", "dateRead", "rating", "shortReview", "longReview", "userReviews.active AS userReviewsActive", "userReviews.createDate AS userReviewsCreateDate", "userReviews.updateDate AS userReviewsUpdatedDate")

users
("userID", "firstName", "lastName", "email", "password", "users.updatedBy AS usersUpdatedBy", "admin", "users.active AS usersActive", "users.createDate AS usersCreateDate", "users.updateDate AS usersUpdatedDate")
*/

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Titles *********
 ******************************/
router.get("/", (request, response) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
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
 ***** Get Title Text *********
 ******************************/
router.get("/text/:titleID", (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

  if (isNaN(formatTrim(titleID)) === true) {

    titleID = 0;

  } else {

    titleID = parseInt(titleID);

  };

  let where = { "titleID": titleID };

  db.select("*")
    .from("titlesText")
    .where(where)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `get /text/:${controllerName}ID error`, error);

      addErrorLog(componentName, `get /text/:${controllerName}ID`, {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Log Image Links *********
 ******************************/
router.get("/broken/:titleID", (request, response) => {

  // response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully logged broken image link. titleID ${request.params.titleID}` });

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

  if (isNaN(formatTrim(titleID)) === true) {

    titleID = 0;

  } else {

    titleID = parseInt(titleID);

  };

  let where = { "titles.titleID": titleID };

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    // .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
    // .leftOuterJoin("users", "users.userID", "userReviews.userID")
    // .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
    // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where(where)
    // .where(activeWhere)
    // .orderBy(orderBy)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        let recordObject = {
          endpoint: `get /broken/:${controllerName}ID records`,
          // editionID: records[0].editionID,
          titleID: records[0].titleID,
          titleName: records[0].titleName,
          imageName: records[0].imageName,
          createDate: getDateTime()
        };

        db("brokenLinks")
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning(select)
          .insert(recordObject)
          .then((results) => {

          })
          .catch((error) => {

            console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID`, error);

            addErrorLog(componentName, `get /broken/:${controllerName}ID`, { titleID: titleID }, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added broken link.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID error`, error);

      addErrorLog(componentName, `get /broken/:${controllerName}ID`, { titleID: titleID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get Titles *********
 ******************************/
// ? ADD OVERALL RATING TO GET TITLE? -- 03/28/2021 MF
// router.get("/", (request, response) => {

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(`${ controllerName } - controller`, getDateTime(), "get / error", error);

//       addErrorLog(componentName, "get /", {}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Title By TitleID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE? -- 03/28/2021 MF
// router.get("/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

// let where = { "titles.titleID": titleID };

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         // response.status(200).json({
//         // titleID:   title.titleID,
//         // titleName:     title.titleName,
//         // titleSort:  title.titleSort,
//         // authorFirstName:   title.authorFirstName,
//         // authorLastName:     title.authorLastName,
//         // publicationDate:  title.publicationDate,
//         // imageName:   title.imageName,
//         // categoryID:   title.categoryID,
//         // shortDescription:     title.shortDescription,
//         // urlPKDWeb:  title.urlPKDWeb,
//         // active:     title.active,
//         // message:    `Successfully retrieved ${ tableName }.`
//         // });
//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(`${ controllerName } - controller`, getDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(componentName, "get /:titleID", {"titleID": titleID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Titles By MediaID *****
***************************************/
// ? Needed? Use Get Editions instead? -- 03/28/2021 MF
// ! There is no column for mediaID in the titles table -- 03/28/2021 MF
// ! Query needs to be changed to work -- 03/28/2021 MF
// ? ADD OVERALL RATING TO GET TITLE? -- 03/28/2021 MF
// router.get("/media/:mediaID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let mediaID = isEmpty(request.params.mediaID) === false ? request.params.mediaID : "";

// if (isNaN(formatTrim(mediaID)) === true) {

//   mediaID = 0;

// } else {

//   mediaID = parseInt(mediaID);

// };

//     // let attributes = {
//     //     attributes: [
//     //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
//     //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
//     //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
//     //     ]
//     // };

//     let query = {where: {
//         [Op.and]: [
//             {mediaID: {[Op.eq]: mediaID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["titleSort", "DESC"]]};

//     Title.findAll(query)
//     .then((results) => {

//         records = convertBitTrueFalse(results);

//         response.status(200).json({message: `Successfully retrieved ${ tableName }.`, records: records });
//     })
//         .catch((error) => {

//             console.error(`${ controllerName } - controller`, getDateTime(), "get /media/:mediaID error", error);

//             addErrorLog(componentName, "get /media/:media", {"mediaID": mediaID}, error);
//             response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//         });

// });


/**************************************
 ***** Get Titles By CategoryID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE? -- 03/28/2021 MF
// router.get("/category/:categoryID/:sort?", (request, response) => {

//   let orderByColumn = "titleSort";

//   if (request.params.sort == "publicationDate") {

//     orderByColumn = "publicationDate";

//   } else {

//     orderByColumn = "titleSort";

//   };

//   let orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let categoryID = isEmpty(request.params.categoryID) === false ? request.params.categoryID : "";

// if (isNaN(formatTrim(categoryID)) === true) {

//   categoryID = 0;

// } else {

//   categoryID = parseInt(categoryID);

// };

// let where = { "titles.categoryID": categoryID };

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(`${ controllerName } - controller`, getDateTime(), "get /category/:categoryID error", error);

//       addErrorLog(componentName, "get /category/:categoryID", {"categoryID": categoryID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Titles By CategoryID Admin *****
***************************************/
// router.get("/admin/category/:categoryID/:sort?", validateAdmin, (request, response) => {

//   let orderByColumn = "titleSort";

//   if (request.params.sort == "publicationDate") {

//     orderByColumn = "publicationDate";

//   } else {

//     orderByColumn = "titleSort";

//   };

//   let orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let categoryID = isEmpty(request.params.categoryID) === false ? request.params.categoryID : "";

// if (isNaN(formatTrim(categoryID)) === true) {

//   categoryID = 0;

// } else {

//   categoryID = parseInt(categoryID);

// };

// let where = { "titles.categoryID": categoryID };

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
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(`${ controllerName } - controller`, getDateTime(), "get /category/:categoryID error", error);

//       addErrorLog(componentName, "get /admin/category/:categoryID", {"categoryID": categoryID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Titles/Checklist *****
***************************************/
// router.get("/checklist/list", validateSession, (request, response) => {
router.get("/checklist", validateSession, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  if (isNaN(formatTrim(userID)) === true) {

    userID = 0;

  } else {

    userID = parseInt(userID);

  };

  // SELECT * FROM titles LEFT OUTER JOIN userReviews on titles.titleID = userReviews.titleID
  // LEFT OUTER JOIN categories on categories.categoryID = titles.categoryID
  // WHERE titles.active = 1 AND categories.active = 1 AND (userReviews.active = 1 OR userReviews.active is null)
  // AND (userReviews.userID = 1 OR userReviews.userID is null)

  // let orderByColumn = "titleSort";
  let orderByDynamic;

  if (request.params.sort == "publicationDate") {

    // orderByColumn = "publicationDate";
    // orderByDynamic = [{ column: "publicationDate", order: "asc" }, { column: "titleSort", order: "asc" }];
    orderByDynamic = "publicationDate ASC, titleSort ASC";

  } else {

    // orderByColumn = "titleSort";
    // orderByDynamic = [{ column: "titleSort", order: "asc" }];
    orderByDynamic = " titleSort ASC";

  };

  // let orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

  // // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  // SELECT titles.*, categories.*, userReviews.*, userReviews.updatedBy AS userReviewUpdatedBy, userReviews.active AS userReviewActive, userReviews.createDate AS userReviewCreateDate, userReviews.updateDate AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  // WHERE (userReviews.userID = 2 AND
  // (userReviews.active = 1 OR userReviews.active IS null) 
  // AND titles.active = 'true'
  // AND categories.active = 'true'

  // UNION ALL

  // SELECT titles.*, categories.*, null AS reviewID, null AS userID, null AS updatedB, null AS titleID, null AS 'read', null AS dateRead, null AS rating, null AS ranking, null AS shortReview, null AS longReview, null AS owned, null AS datePurchASed, null AS active, null AS createDate, null AS updateDate, null AS userReviewUpdatedBy, null AS userReviewActive, null AS userReviewCreateDate, null AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate
  // FROM titles
  // LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID
  // LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  // WHERE titles.titleID NOT IN (
  // SELECT titles.titleID
  // FROM titles
  // LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID
  // LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  // WHERE (userReviews.userID = 2 AND
  // (userReviews.active = 1 OR userReviews.active IS null) 
  // AND titles.active = 'true'
  // AND categories.active = 'true'
  // )
  // AND titles.active = 'true'
  // AND categories.active = 'true'

  // ORDER BY titleSort ASC

  let sqlQuery = `SELECT titles.*, categories.*, userReviews.*, userReviews.updatedBy AS userReviewUpdatedBy, userReviews.active AS userReviewActive, userReviews.createDate AS userReviewCreateDate, userReviews.updateDate AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE (userReviews.userID = ${userID} OR userReviews.active IS null) AND (userReviews.active = 1 OR userReviews.active IS null) AND titles.active = 1 AND categories.active = 1 UNION ALL SELECT titles.*, categories.*, null AS reviewID, null AS userID, null AS updatedB, null AS titleID, null AS 'read', null AS dateRead, null AS rating, null AS ranking, null AS shortReview, null AS longReview, null AS owned, null AS datePurchASed, null AS active, null AS createDate, null AS updateDate, null AS userReviewUpdatedBy, null AS userReviewActive, null AS userReviewCreateDate, null AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE titles.titleID NOT IN (SELECT titles.titleID FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE (userReviews.userID = ${userID} OR userReviews.active IS null) AND (userReviews.active = 1 OR userReviews.active IS null) AND titles.active = 1 AND categories.active = 1) AND titles.active = 1 AND categories.active = 1 ORDER BY ${orderByDynamic}`;


  // db.select(checklistColumnsList)
  //   .from(tableName)
  //   .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
  //   // .leftOuterJoin("users", "users.userID", "userReviews.userID")
  //   .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
  //   // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
  //   // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
  //   // .where("users.userID", userID)
  //   // .where("userReviews.userID", userID)
  //   .where(function () { this.where("userReviews.userID", userID).orWhereNull("userReviews.userID"); })
  //   // .where("userID", userID)
  //   // .where(activeChecklist)
  //   .where(function () { this.where("userReviews.active", 1).orWhereNull("userReviews.active"); })
  //   .where({ "titles.active": true, "categories.active": true })
  //   // .where("editions.active", true)
  //   // .where("media.active", true)
  //   .orderBy(orderByDynamic)

  db.raw(sqlQuery)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records[0] });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /checklist error", error);

      addErrorLog(componentName, "get /checklist", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Titles/Checklist By CategoryID *****
***************************************/
// router.get("/checklist/:categoryID/:sort?", validateSession, (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

// if (isNaN(formatTrim(userID)) === true) {

//   userID = 0;

// } else {

//   userID = parseInt(userID);

// };

//   let orderByColumn = "titleSort";

//   if (request.params.sort == "publicationDate") {

//     orderByColumn = "publicationDate";

//   } else {

//     orderByColumn = "titleSort";

//   };

//   let orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

// let categoryID = isEmpty(request.params.categoryID) === false ? request.params.categoryID : "";

// if (isNaN(formatTrim(categoryID)) === true) {

//   categoryID = 0;

// } else {

//   categoryID = parseInt(categoryID);

// };

// let where = { "titles.categoryID": categoryID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where("users.userID", userID)
//     .where(activeChecklist)
//     // .where("editions.active", true)
//     // .where("media.active", true)
//     .orderBy(orderByDynamic)
//     .then((results) => {

//       records = convertBitTrueFalse(results);

//       if (isNonEmptyArray(records) === true) {

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(`${ controllerName } - controller`, getDateTime(), "get /checklist/:categoryID error", error);

//       addErrorLog(componentName, "get /checklist/:categoryID", {"categoryID": categoryID}, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Title ***************
*********************************/
router.post("/", validateAdmin, (request, response) => {

  let recordObject = {
    titleName: request.body.recordObject.titleName,
    titleSort: formatLowerCase(request.body.recordObject.titleName).replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: request.body.recordObject.titleURL,
    authorFirstName: request.body.recordObject.authorFirstName,
    authorLastName: request.body.recordObject.authorLastName,
    manuscriptTitle: request.body.recordObject.manuscriptTitle,
    writtenDate: request.body.recordObject.writtenDate,
    submissionDate: request.body.recordObject.submissionDate,
    publicationDate: request.body.recordObject.publicationDate,
    imageName: request.body.recordObject.imageName,
    categoryID: request.body.recordObject.categoryID,
    shortDescription: request.body.recordObject.shortDescription,
    urlPKDWeb: request.body.recordObject.urlPKDWeb,
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

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Update Title *******
 ***************************/
router.put("/:titleID", validateAdmin, (request, response) => {

  let recordObject = {
    titleName: request.body.recordObject.titleName,
    titleSort: formatLowerCase(request.body.recordObject.titleName).replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: request.body.recordObject.titleURL,
    authorFirstName: request.body.recordObject.authorFirstName,
    authorLastName: request.body.recordObject.authorLastName,
    manuscriptTitle: request.body.recordObject.manuscriptTitle,
    writtenDate: request.body.recordObject.writtenDate,
    submissionDate: request.body.recordObject.submissionDate,
    publicationDate: request.body.recordObject.publicationDate,
    imageName: request.body.recordObject.imageName,
    categoryID: request.body.recordObject.categoryID,
    shortDescription: request.body.recordObject.shortDescription,
    urlPKDWeb: request.body.recordObject.urlPKDWeb,
    active: request.body.recordObject.active
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

  if (isNaN(formatTrim(titleID)) === true) {

    titleID = 0;

  } else {

    titleID = parseInt(titleID);

  };

  let where = { titleID: titleID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.titleID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.titleID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /: ${controllerName}ID error`, error);

      addErrorLog(componentName, `put /:${controllerName}ID`, { titleID: request.params.titleID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Delete Title *******
 ***************************/
router.delete("/:titleID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

  if (isNaN(formatTrim(titleID)) === true) {

    titleID = 0;

  } else {

    titleID = parseInt(titleID);

  };

  let where = { titleID: titleID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.titleID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.titleID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(componentName, `delete /:${controllerName}ID`, { titleID: titleID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;