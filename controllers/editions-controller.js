"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "editions";
const tableName = "editions";
const select = "*";
// const activeWhere = { "editions.active": true, "titles.active": true, "media.active": true };
const activeDataWhere = { "titles.active": true, "media.active": true };
const orderBy = [{ column: "editions.publicationDate", order: "desc" }];

// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createDate, updateDate -- 06/01/2021 MF
const columnsList = ["*", "editions.publicationDate AS editionPublicationDate", "editions.imageName AS editionImageName", "editions.active AS editionActive", "editions.createDate AS editionCreateDate", "editions.updateDate AS editionUpdatedDate", "titles.publicationDate AS titlePublicationDate", "titles.imageName AS titleImageName", "titles.active AS titleActive", "titles.createDate AS titleCreateDate", "titles.updateDate AS titleUpdatedDate", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreateDate", "media.updateDate AS mediaUpdatedDate"];

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
 ***** Get Editions *********
 ******************************/
// * Returns all editions active or not -- 03/28/2021 MF
// router.get("/list", (request, response) => {
router.get("/", (request, response) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `get / ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(componentName, getDateTime(), "get / No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "get / error", error);

      addErrorLog(componentName, "get /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Log Broken Amazon Link *********
 ******************************/
// * Logs that a broken link was found on a page loaded. -- 08/13/2021 MF
router.get("/broken/:editionID", (request, response) => {

  // console.log(componentName, getDateTime(), `get /broken/:${controllerName}ID ${tableName}`, request.params.editionID);

  // response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully logged broken image link. editionID ${request.params.editionID}` });

  const where = { editionID: request.params.editionID };

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where(where)
    // .where("editions.active", true)
    // .where(activeDataWhere)
    // .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `get /broken/:${controllerName}ID ${tableName}`, records);

        // console.log(componentName, getDateTime(), `get /broken/:${controllerName}ID records`, "editionID", records[0].editionID, "titleID", records[0].titleID, "titleName", records[0].titleName, "imageName", records[0].imageName);

        const recordObject = {
          endpoint: `get /broken/:${controllerName}ID records`,
          editionID: records[0].editionID,
          titleID: records[0].titleID,
          titleName: records[0].titleName,
          imageName: records[0].imageName,
          createDate: getDateTime()
        };

        db("brokenLinks")
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning(select)
          .insert(recordObject)
          .then((records) => {
            // console.log(`${ controllerName } - controller`, getDateTime(), `get /broken/:${controllerName}ID brokenLinks`, records);

          })
          .catch((error) => {
            console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID`, error);

            addErrorLog(componentName, `get /broken/:${controllerName}ID`, records, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added broken link.", records: records });

      } else {
        console.log(componentName, getDateTime(), `get /broken/:${controllerName}ID No Results`);

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID error`, error);

      addErrorLog(componentName, "get /broken/:${controllerName}ID", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});



/******************************
 ***** Get Editions *********
 ******************************/
// router.get("/", (request, response) => {

//   // let sqlQuery = db.select(select)
//   //   .from(tableName)
//   //   .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//   //   .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//   //   .where(activeWhere)
//   //   .orderBy(orderBy)
//   //   .toSQL();
//   // // .toString();

//   // * .replace() and .replaceAll() are not working
//   // sqlQuery = sqlQuery.replaceAll("'", "").replaceAll("`", "");

//   // select * from editions left outer join titles on titles.titleID = editions.titleID left outer join media on media.mediaID = editions.mediaID where editions.active = 1 and titles.active = 1 and media.active = 1 order by editions.publicationDate desc

//   // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(componentName, getDateTime(), `get / ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(componentName, getDateTime(), "get / No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), "get / error", error);

//       addErrorLog(componentName, "get /", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Edition By EditionID *****
***************************************/
// router.get("/:editionID", (request, response) => {

//   const where = { editionID: request.params.editionID };

//   // let sqlQuery = db.select(select)
//   //   .from(tableName)
//   //   .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//   //   .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//   //   .where(where)
//   //   // .where("editions.active", true)
//   //   .where("titles.active", true)
//   //   .where("media.active", true)
//   //   .orderBy(orderBy)
//   //   .toSQL();
//   // // .toString();

//   // select * from editions left outer join titles on titles.titleID = editions.titleID left outer join media on media.mediaID = editions.mediaID where editionID = 1 and titles.active = true and media.active = true order by editions.publicationDate desc

//   // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     // .where("editions.active", true)
//     .where(activeDataWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });
//         // response.status(200).json({
//         // editionID:  edition.editionID,
//         // titleID:    edition.titleID,
//         // mediaID:    edition.mediaID,
//         // amazonLinkID:   edition.amazonLinkID,
//         // publicationDate:  edition.publicationDate,
//         // imageName:  edition.imageName,
//         // ASIN:              edition.ASIN,
//         // textLinkShort:     edition.textLinkShort,
//         // textLinkFull:     edition.textLinkFull,
//         // imageLinkSmall:     edition.imageLinkSmall,
//         // imageLinkMedium:     edition.imageLinkMedium,
//         // imageLinkLarge:     edition.imageLinkLarge,
//         // textImageLink:     edition.textImageLink,
//         // active:     edition.active,
//         // message:    "Successfully retrieved edition."
//         // });

//       } else {
//         // console.log(componentName, getDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(componentName, "get /", records, error);  
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Edition By ASIN *****
***************************************/
router.get("/ASIN/:ASIN", (request, response) => {

  const where = { ASIN: request.params.ASIN };

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where(where)
    // .where("editions.active", true)
    .where(activeDataWhere)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), "get /ASIN/:ASIN", records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });
        // response.status(200).json({
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
        // message:    "Successfully retrieved edition."
        // });

      } else {
        // console.log(componentName, getDateTime(), `get /ASIN/:ASIN No Results`);

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "get /ASIN/:ASIN", error);

      addErrorLog(componentName, "get /ASIN/:ASIN", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Editions By TitleID *****
***************************************/
// router.get("/title/:titleID", (request, response) => {

//   const where = { "editions.titleID": request.params.titleID };

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(componentName, getDateTime(), `get /title/:titleID ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(componentName, getDateTime(), "get /title/:titleID No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), "get /title/:titleID error", error);

//       addErrorLog(componentName, "get /title/:titleID", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Editions By MediaID *****
***************************************/
// router.get("/media/:mediaID", (request, response) => {

//   const where = { "editions.mediaID": request.params.mediaID };

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(componentName, getDateTime(), `get /media/:mediaID ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(componentName, getDateTime(), "get /media/:mediaID No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), "get /media/:mediaID error", error);

//       addErrorLog(componentName, "get /media/:media", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Editions By CategoryID *****
***************************************/
// ? Needed? Use Get Titles instead? -- 03/28/2021 MF
// ! There is no column for categoryID in the editions table -- 03/28/2021 MF
// ! Query needs to be changed to work -- 03/28/2021 MF
// router.get("/category/:categoryID", (request, response) => {

//     const query = {where: {
//         [Op.and]: [
//             {categoryID: {[Op.eq]: request.params.categoryID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["publicationDate", "DESC"]]};

//     Edition.findAll(query)
//     .then((records) => {
//         // console.log(componentName, getDateTime(), `get /category/:categoryID ${tableName}`, records);
//         response.status(200).json({message: `Successfully retrieved ${tableName}.`, records: records });
//     })
//     .catch((error) => {
//         console.error(componentName, getDateTime(), "get /category/:categoryID error", error);

//         addErrorLog(componentName, "get /category/:categoryID", records, error);
//         response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Edition ***************
*********************************/
// * Allows an admin to add a new edition -- 03/28/2021 MF
router.post("/", validateAdmin, (request, response) => {

  const recordObject = {
    titleID: request.body.edition.titleID,
    mediaID: request.body.edition.mediaID,
    publicationDate: request.body.edition.publicationDate,
    imageName: request.body.edition.imageName,
    ASIN: request.body.edition.ASIN,
    textLinkShort: request.body.edition.textLinkShort,
    textLinkFull: request.body.edition.textLinkFull,
    imageLinkSmall: request.body.edition.imageLinkSmall,
    imageLinkMedium: request.body.edition.imageLinkMedium,
    imageLinkLarge: request.body.edition.imageLinkLarge,
    textImageLink: request.body.edition.textImageLink,
    active: true
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(componentName, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), "post / records", records);

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(componentName, getDateTime(), "post / No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "post / error", error);
      // console.log(componentName, getDateTime(), "post / error.name", error.name);
      // console.log(componentName, getDateTime(), "post / error.errors[0].message", error.errors[0].message);

      let errorMessages = "";

      if (Array.isArray(error.errors) === true) {

        for (let i = 0; i < error.errors.length; i++) {
          //console.log(componentName, getDateTime(), "post / error.errors[i].message", error.errors[i].message);

          if (i > 1) {

            errorMessages = errorMessages + ", ";

          };

          errorMessages = errorMessages + error.errors[i].message;

        };

      };

      addErrorLog(componentName, "post /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Update Edition *******
 ***************************/
// * Allows the admin to update the edition including soft delete it -- 03/28/2021 MF
router.put("/:editionID", validateAdmin, (request, response) => {

  const recordObject = {
    titleID: request.body.edition.titleID,
    mediaID: request.body.edition.mediaID,
    publicationDate: request.body.edition.publicationDate,
    imageName: request.body.edition.imageName,
    ASIN: request.body.edition.ASIN,
    textLinkShort: request.body.edition.textLinkShort,
    textLinkFull: request.body.edition.textLinkFull,
    imageLinkSmall: request.body.edition.imageLinkSmall,
    imageLinkMedium: request.body.edition.imageLinkMedium,
    imageLinkLarge: request.body.edition.imageLinkLarge,
    textImageLink: request.body.edition.textImageLink,
    active: request.body.edition.active
  };

  const where = { editionID: request.params.editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(componentName, getDateTime(), `put /:${controllerName}ID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `put /:${controllerName}ID records`, records);

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(componentName, getDateTime(), `put /:${controllerName}ID No Results`);

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(componentName, `put /:${controllerName}ID`, records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Delete Edition *******
 ***************************/
// * Allows an admin to hard delete an edition -- 03/28/2021 MF
router.delete("/:editionID", validateAdmin, (request, response) => {

  const where = { editionID: request.params.editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(componentName, getDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(componentName, getDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {
        // console.log(componentName, getDateTime(), `delete /:${controllerName}ID No Results`);

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(componentName, `delete /:${controllerName}ID`, records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;