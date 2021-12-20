"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime, convertBitTrueFalse } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "titles";
const tableName = "titles";
const select = "*";
// const activeWhere = { "titles.active": true, /*"userReviews.active": true, "users.active": true,*/ "categories.active": true, "editions.active": true, "media.active": true };
// const activeChecklist = { "titles.active": true, "userReviews.active": true, /*"users.active": true,*/ "categories.active": true };
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

let records;


/******************************
 ***** Get Titles *********
 ******************************/
// * Returns all titles active or not -- 03/28/2021 MF
// * Just the title data and not the related tables data -- 03/28/2021 MF
// router.get("/list", (request, response) => {
router.get("/", (request, response) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
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
 ***** Log Image Links *********
 ******************************/
// * Logs that a broken link was found on a page loaded. -- 08/13/2021 MF
router.get("/broken/:titleID", (request, response) => {

  // console.log(`${controllerName}-controller`, GetDateTime(), get /broken/:${controllerName}ID ${tableName}, request.params.titleID);

  // response.status(200).json({ resultsFound: true, message: `Successfully logged broken image link. titleID ${request.params.titleID}` });

  const where = { "titles.titleID": request.params.titleID };

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
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `get /broken/:${controllerName}ID brokenLinks`, records);

        console.log(`${controllerName}-controller`, GetDateTime(), `get /broken/:${controllerName}ID records`, "titleID", records[0].titleID, "titleName", records[0].titleName, "imageName", records[0].imageName);

        const recordObject = {
          endpoint: `get /broken/:${controllerName}ID records`,
          // editionID: records[0].editionID,
          titleID: records[0].titleID,
          titleName: records[0].titleName,
          imageName: records[0].imageName,
          createDate: GetDateTime()
        };

        db("brokenLinks")
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning(select)
          .insert(recordObject)
          .then((records) => {
            // console.log(`${ controllerName } - controller`, GetDateTime(), `get /broken/:${controllerName}ID brokenLinks`, records);

          })
          .catch((error) => {
            console.log(`${controllerName}-controller`, GetDateTime(), `get /broken/:${controllerName}ID`, error);

            addErrorLog(`${controllerName}-controller`, `get /broken/:${controllerName}ID`, records, error);
            // response.status(500).json({ recordAdded: false, message: `Not successfully created brokenLinks.`, error: error });

          });

        response.status(200).json({ resultsFound: true, message: `Successfully retrieved brokenLinks.`, records: records });

      } else {
        console.log(`${controllerName}-controller`, GetDateTime(), `get /broken/:${controllerName}ID No Results`);

        // response.status(200).send(`No ${tableName} found.`);
        // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
        response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `get /broken/:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, "get /broken/:${controllerName}ID", records, error);
      response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get / records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${ tableName }.`, records: records });

//       } else {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get / No Results");

//         // response.status(200).send(`No ${ tableName } found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${ tableName } found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${ controllerName } - controller`, GetDateTime(), "get / error", error);

//       addErrorLog(`${controllerName}-controller`, "get /", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${ tableName } found.`, error: error });

//     });

// });


/**************************************
 ***** Get Title By TitleID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE? -- 03/28/2021 MF
// router.get("/:titleID", (request, response) => {

//   const where = { "titles.titleID": request.params.titleID };

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
//         // console.log(`${ controllerName } - controller`, GetDateTime(), `get /:${controllerName}ID records`, records);

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
//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${ tableName }.`, records: records });

//       } else {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), `get /: ${ controllerName }ID ${ tableName } No Results`);

//         // response.status(200).send(`No ${ tableName } found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${ tableName } found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${ controllerName } - controller`, GetDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(`${controllerName}-controller`, "get /:titleID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${ tableName } found.`, error: error });

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

//     // const attributes = {
//     //     attributes: [
//     //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
//     //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
//     //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
//     //     ]
//     // };

//     const query = {where: {
//         [Op.and]: [
//             {mediaID: {[Op.eq]: request.params.mediaID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["titleSort", "DESC"]]};

//     Title.findAll(query)
//     .then((records) => {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /media/:mediaID" records", records);
//         response.status(200).json({message: `Successfully retrieved ${ tableName }.`, records: records });
//     })
//         .catch((error) => {
//             console.log(`${ controllerName } - controller`, GetDateTime(), "get /media/:mediaID error", error);

//             addErrorLog(`${controllerName}-controller`, "get /media/:media", records, error);
//             response.status(500).json({resultsFound: false, message: `No ${ tableName } found.`, error: err});

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

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": request.params.categoryID };

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
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${ tableName }.`, records: records });

//       } else {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID No Results");

//         // response.status(200).send(`No ${ tableName } found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${ tableName } found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /category/:categoryID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${ tableName } found.`, error: error });

//     });

// });


/**************************************
 ***** Get Titles By CategoryID Admin *****
***************************************/
// * Return all titles to adminster them -- 03/28/2021 MF
// router.get("/admin/category/:categoryID/:sort?", validateAdmin, (request, response) => {

//   let orderByColumn = "titleSort";

//   if (request.params.sort == "publicationDate") {

//     orderByColumn = "publicationDate";

//   } else {

//     orderByColumn = "titleSort";

//   };

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": request.params.categoryID };

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
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${ tableName }.`, records: records });

//       } else {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID No Results");

//         // response.status(200).send(`No ${ tableName } found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${ tableName } found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${ controllerName } - controller`, GetDateTime(), "get /category/:categoryID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /admin/category/:categoryID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${ tableName } found.`, error: error });

//     });

// });


/**************************************
 ***** Get Titles/Checklist *****
***************************************/
// router.get("/checklist/list", validateSession, (request, response) => {
router.get("/checklist", validateSession, (request, response) => {

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

  // const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

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

  let sqlQuery = `SELECT titles.*, categories.*, userReviews.*, userReviews.updatedBy AS userReviewUpdatedBy, userReviews.active AS userReviewActive, userReviews.createDate AS userReviewCreateDate, userReviews.updateDate AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE (userReviews.userID = ${request.user.userID} OR userReviews.active IS null) AND (userReviews.active = 1 OR userReviews.active IS null) AND titles.active = 1 AND categories.active = 1 UNION ALL SELECT titles.*, categories.*, null AS reviewID, null AS userID, null AS updatedB, null AS titleID, null AS 'read', null AS dateRead, null AS rating, null AS ranking, null AS shortReview, null AS longReview, null AS owned, null AS datePurchASed, null AS active, null AS createDate, null AS updateDate, null AS userReviewUpdatedBy, null AS userReviewActive, null AS userReviewCreateDate, null AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE titles.titleID NOT IN (SELECT titles.titleID FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID WHERE (userReviews.userID = ${request.user.userID} OR userReviews.active IS null) AND (userReviews.active = 1 OR userReviews.active IS null) AND titles.active = 1 AND categories.active = 1) AND titles.active = 1 AND categories.active = 1 ORDER BY ${orderByDynamic}`;

  // console.log(`${ controllerName } - controller`, GetDateTime(), "get / sqlQuery", sqlQuery);

  // db.select(checklistColumnsList)
  //   .from(tableName)
  //   .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
  //   // .leftOuterJoin("users", "users.userID", "userReviews.userID")
  //   .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
  //   // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
  //   // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
  //   // .where("users.userID", request.user.userID)
  //   // .where("userReviews.userID", request.user.userID)
  //   .where(function () { this.where("userReviews.userID", request.user.userID).orWhereNull("userReviews.userID"); })
  //   // .where("userID", request.user.userID)
  //   // .where(activeChecklist)
  //   .where(function () { this.where("userReviews.active", 1).orWhereNull("userReviews.active"); })
  //   .where({ "titles.active": true, "categories.active": true })
  //   // .where("editions.active", true)
  //   // .where("media.active", true)
  //   .orderBy(orderByDynamic)

  db.raw(sqlQuery)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(`${ controllerName } - controller`, GetDateTime(), "get /checklist records[0]", records[0]);

        response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records[0] });

      } else {
        // console.log(`${ controllerName } - controller`, GetDateTime(), "get /checklist No Results");

        // response.status(200).send(`No ${ tableName } found.`);
        // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
        response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), "get /checklist error", error);

      addErrorLog(`${controllerName}-controller`, "get /checklist", records, error);
      response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

    });

});


/**************************************
 ***** Get Titles/Checklist By CategoryID *****
***************************************/
// router.get("/checklist/:categoryID/:sort?", validateSession, (request, response) => {

//   let orderByColumn = "titleSort";

//   if (request.params.sort == "publicationDate") {

//     orderByColumn = "publicationDate";

//   } else {

//     orderByColumn = "titleSort";

//   };

//   const orderByDynamic = [{ column: orderByColumn, order: "asc" }, { column: "titleSort", order: "asc" }];

//   const where = { "titles.categoryID": request.params.categoryID };

//   // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("userReviews", "userReviews.titleID", "titles.titleID")
//     .leftOuterJoin("users", "users.userID", "userReviews.userID")
//     .leftOuterJoin("categories", "categories.categoryID", "titles.categoryID")
//     // .leftOuterJoin("editions", "editions.titleID", "titles.titleID")
//     // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where("users.userID", request.user.userID)
//     .where(activeChecklist)
//     // .where("editions.active", true)
//     // .where("media.active", true)
//     .orderBy(orderByDynamic)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /checklist/:categoryID records", records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${ tableName }.`, records: records });

//       } else {
//         // console.log(`${ controllerName } - controller`, GetDateTime(), "get /checklist/:categoryID No Results");

//         // response.status(200).send(`No ${ tableName } found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${ tableName } found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${ tableName } found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${ controllerName } - controller`, GetDateTime(), "get /checklist/:categoryID error", error);

//       addErrorLog(`${controllerName}-controller`, "get /checklist/:categoryID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${ tableName } found.`, error: error });

//     });

// });


/* ******************************
 *** Add Title ***************
*********************************/
// * Allows an admin to add a new title -- 03/28/2021 MF
router.post("/", validateAdmin, (request, response) => {

  const recordObject = {
    titleName: request.body.title.titleName,
    titleSort: request.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: request.body.title.titleURL,
    authorFirstName: request.body.title.authorFirstName,
    authorLastName: request.body.title.authorLastName,
    submissionDate: request.body.title.submissionDate,
    publicationDate: request.body.title.publicationDate,
    imageName: request.body.title.imageName,
    categoryID: request.body.title.categoryID,
    shortDescription: request.body.title.shortDescription,
    urlPKDWeb: request.body.title.urlPKDWeb,
    active: true
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(`${ controllerName } - controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      recordObject.titleID = records[0];

      if (records > 0) {
        // console.log(`${ controllerName } - controller`, GetDateTime(), "post / records", records);

        response.status(200).json({ recordAdded: true, message: `Successfully created ${tableName}.`, records: [recordObject] });

      } else {
        // console.log(`${ controllerName } - controller`, GetDateTime(), "post / No Results");

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
 ******* Update Title *******
 ***************************/
// * Allows the admin to update the title including soft delete it -- 03/28/2021 MF
router.put("/:titleID", validateAdmin, (request, response) => {

  const recordObject = {
    titleName: request.body.title.titleName,
    titleSort: request.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: request.body.title.titleURL,
    authorFirstName: request.body.title.authorFirstName,
    authorLastName: request.body.title.authorLastName,
    submissionDate: request.body.title.submissionDate,
    publicationDate: request.body.title.publicationDate,
    imageName: request.body.title.imageName,
    categoryID: request.body.title.categoryID,
    shortDescription: request.body.title.shortDescription,
    urlPKDWeb: request.body.title.urlPKDWeb,
    active: request.body.title.active
  };

  const where = { titleID: request.params.titleID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${ controllerName } - controller`, GetDateTime(), `put /: ${ controllerName }ID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${ controllerName } - controller`, GetDateTime(), `put /: ${ controllerName }ID records`, records);

        response.status(200).json({ recordUpdated: true, message: `Successfully updated ${tableName}.`, records: [recordObject] });

      } else {
        // console.log(`${ controllerName } - controller`, GetDateTime(), `put /: ${ controllerName }ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordUpdated: false, message: "Nothing to update.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `put /: ${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `put /:${controllerName}ID`, records, error);
      response.status(500).json({ recordUpdated: false, message: `Not successfully updated ${tableName}.`, error: error });

    });

});


/***************************
 ******* Delete Title *******
 ***************************/
// * Allows an admin to hard delete a title -- 03/28/2021 MF
router.delete("/:titleID", validateAdmin, (request, response) => {

  const where = { titleID: request.params.titleID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(`${ controllerName } - controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);;
      // * Returns the number of deleted records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ recordDeleted: true, message: `Successfully deleted ${tableName}.`, titleID: request.params.titleID });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordDeleted: false, message: "Nothing to delete.", titleID: request.params.titleID });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `delete /:${controllerName}ID`, records, error);
      response.status(500).json({ recordDeleted: false, message: `Not successfully deleted ${tableName}.`, error: error });

    });

});


module.exports = router;