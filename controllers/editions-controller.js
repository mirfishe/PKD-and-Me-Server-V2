"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, isNonEmptyArray, formatTrim } = require("../utilities/sharedFunctions");
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
router.get("/", (request, response) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

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
 ***** Log Broken Amazon Link *********
 ******************************/
// * Logs that a broken link was found on a page loaded. -- 08/13/2021 MF
router.get("/broken/:editionID", (request, response) => {

  // response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully logged broken image link. editionID ${request.params.editionID}` });

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let editionID = isEmpty(request.params.editionID) === false ? request.params.editionID : "";

  if (isNaN(formatTrim(editionID)) === true) {

    editionID = 0;

  } else {

    editionID = parseInt(editionID);

  };

  const where = { editionID: editionID };

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

          })
          .catch((error) => {

            console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID`, error);

            addErrorLog(componentName, `get /broken/:${controllerName}ID`, { editionID: editionID }, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully added broken link.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `get /broken/:${controllerName}ID error`, error);

      addErrorLog(componentName, "get /broken/:${controllerName}ID", { editionID: editionID }, error);
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

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {

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
 ***** Get Edition By EditionID *****
***************************************/
// router.get("/:editionID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let editionID = isEmpty(request.params.editionID) === false ? request.params.editionID : "";

// if (isNaN(formatTrim(editionID)) === true) {

//   editionID = 0;

// } else {

//   editionID = parseInt(editionID);

// };

// const where = { editionID: editionID };

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

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(componentName, "get /", {}, error);  
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Edition By ASIN *****
***************************************/
router.get("/ASIN/:ASIN", (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let ASIN = isEmpty(request.params.ASIN) === false ? request.params.ASIN : "";

  const where = { ASIN: ASIN };

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

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /ASIN/:ASIN", error);

      addErrorLog(componentName, "get /ASIN/:ASIN", { ASIN: ASIN }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Editions By TitleID *****
***************************************/
// router.get("/title/:titleID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let titleID = isEmpty(request.params.titleID) === false ? request.params.titleID : "";

// if (isNaN(formatTrim(titleID)) === true) {

//   titleID = 0;

// } else {

//   titleID = parseInt(titleID);

// };

// const where = { "editions.titleID": titleID };

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
 ***** Get Editions By MediaID *****
***************************************/
// router.get("/media/:mediaID", (request, response) => {

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let mediaID = isEmpty(request.params.mediaID) === false ? request.params.mediaID : "";

// if (isNaN(formatTrim(mediaID)) === true) {

//   mediaID = 0;

// } else {

//   mediaID = parseInt(mediaID);

// };

// const where = { "editions.mediaID": mediaID };

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

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {

//       console.error(componentName, getDateTime(), "get /media/:mediaID error", error);

//       addErrorLog(componentName, "get /media/:media", {"mediaID": mediaID}, error);
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

// // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let categoryID = isEmpty(request.params.categoryID) === false ? request.params.categoryID : "";

// if (isNaN(formatTrim(categoryID)) === true) {

//   categoryID = 0;

// } else {

//   categoryID = parseInt(categoryID);

// };

//     const query = {where: {
//         [Op.and]: [
//             {categoryID: {[Op.eq]: categoryID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["publicationDate", "DESC"]]};

//     Edition.findAll(query)
//     .then((records) => {

//         response.status(200).json({message: `Successfully retrieved ${tableName}.`, records: records });

//     })
//     .catch((error) => {

//         console.error(componentName, getDateTime(), "get /category/:categoryID error", error);

//         addErrorLog(componentName, "get /category/:categoryID", {"categoryID": categoryID}, error);
//         response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Edition ***************
*********************************/
// * Allows an admin to add a new edition -- 03/28/2021 MF
router.post("/", validateAdmin, (request, response) => {

  const recordObject = {
    titleID: request.body.recordObject.titleID,
    mediaID: request.body.recordObject.mediaID,
    publicationDate: request.body.recordObject.publicationDate,
    imageName: request.body.recordObject.imageName,
    ASIN: request.body.recordObject.ASIN,
    textLinkShort: request.body.recordObject.textLinkShort,
    textLinkFull: request.body.recordObject.textLinkFull,
    imageLinkSmall: request.body.recordObject.imageLinkSmall,
    imageLinkMedium: request.body.recordObject.imageLinkMedium,
    imageLinkLarge: request.body.recordObject.imageLinkLarge,
    textImageLink: request.body.recordObject.textImageLink,
    active: true
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      let errorMessages = "";

      if (isNonEmptyArray(error.errors) === true) {

        for (let i = 0; i < error.errors.length; i++) {

          if (i > 1) {

            errorMessages = errorMessages + ", ";

          };

          errorMessages = errorMessages + error.errors[i].message;

        };

      };

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Update Edition *******
 ***************************/
// * Allows the admin to update the edition including soft delete it -- 03/28/2021 MF
router.put("/:editionID", validateAdmin, (request, response) => {

  const recordObject = {
    titleID: request.body.recordObject.titleID,
    mediaID: request.body.recordObject.mediaID,
    publicationDate: request.body.recordObject.publicationDate,
    imageName: request.body.recordObject.imageName,
    ASIN: request.body.recordObject.ASIN,
    textLinkShort: request.body.recordObject.textLinkShort,
    textLinkFull: request.body.recordObject.textLinkFull,
    imageLinkSmall: request.body.recordObject.imageLinkSmall,
    imageLinkMedium: request.body.recordObject.imageLinkMedium,
    imageLinkLarge: request.body.recordObject.imageLinkLarge,
    textImageLink: request.body.recordObject.textImageLink,
    active: request.body.recordObject.active
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let editionID = isEmpty(request.params.editionID) === false ? request.params.editionID : "";

  if (isNaN(formatTrim(editionID)) === true) {

    editionID = 0;

  } else {

    editionID = parseInt(editionID);

  };

  const where = { editionID: editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(componentName, `put /:${controllerName}ID`, { editionID: request.params.editionID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Delete Edition *******
 ***************************/
// * Allows an admin to hard delete an edition -- 03/28/2021 MF
router.delete("/:editionID", validateAdmin, (request, response) => {

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let editionID = isEmpty(request.params.editionID) === false ? request.params.editionID : "";

  if (isNaN(formatTrim(editionID)) === true) {

    editionID = 0;

  } else {

    editionID = parseInt(editionID);

  };

  const where = { editionID: editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.editionID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(componentName, `delete /:${controllerName}ID`, { editionID: editionID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;