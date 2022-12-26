"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "terms";
const tableName = "terms";
const select = "*";
// const activeWhere = { "terms.active": true };
const orderBy = [{ column: "term", order: "asc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Terms *********
 ******************************/
// * Returns all terms active or not -- 03/28/2021 MF
// * Just the term data and not the related tables data -- 03/28/2021 MF
router.get("/", (request, response) => {

  db.select(select)
    .from(tableName)
    // * Doesn't return any results unless there is a category for the term. Obsolete, anyway. -- 01/16/2022 MF
    // .leftOuterJoin("termsCategories", "termsCategories.termID", "terms.termID")
    // .leftOuterJoin("termCategories", "termsCategories.termCategoryID", "termCategories.termCategoryID")
    // .where(activeWhere)
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

      addErrorLog(componentName, "get /", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/**************************************
 ***** Get Term *****
***************************************/
router.get("/:termID", (request, response) => {

  // // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  // let userID = isEmpty(request.user.userID) === false ? request.user.userID : "";

  // if (isNaN(formatTrim(userID)) === true) {

  //   userID = 0;

  // } else {

  //   userID = parseInt(userID);

  // };

  let termID = isEmpty(request.params.termID) === false ? request.params.termID : "";

  if (isNaN(formatTrim(termID)) === true) {

    termID = 0;

  } else {

    termID = parseInt(termID);

  };

  let sqlQuery = `SELECT terms.termID, terms.term, terms.definition, terms.partOfSpeech, terms.parentTermID, termsParent.term AS termParent, termCategories.termCategoryID, termCategories.termCategory, GROUP_CONCAT(termsSynonyms.term) AS termsSynonym, GROUP_CONCAT(termsAlternateForms.term) AS termsAlternateForm, chapter, quotation, titles.titleID, titles.titleName, titles.titleSort, titles.titleURL, titles.authorFirstName, titles.authorLastName, titles.submissionDate, titles.publicationDate, titles.imageName, titles.categoryID, titles.shortDescription, titles.urlPKDWeb FROM terms LEFT OUTER JOIN terms AS termsParent ON terms.parentTermID = termsParent.termID LEFT OUTER JOIN termsCategories ON terms.termID = termsCategories.termID LEFT OUTER JOIN termCategories ON termsCategories.termCategoryID = termCategories.termCategoryID LEFT OUTER JOIN synonyms ON terms.termID = synonyms.termID LEFT OUTER JOIN terms AS termsSynonyms ON synonyms.synonymID = termsSynonyms.termID LEFT OUTER JOIN alternateForms ON terms.termID = alternateForms.termID LEFT OUTER JOIN terms AS termsAlternateForms ON alternateForms.alternateFormID = termsAlternateForms.termID LEFT OUTER JOIN termsTitles ON terms.termID = termsTitles.termID LEFT OUTER JOIN titles ON termsTitles.titleID = titles.titleID WHERE terms.termID = ${termID} GROUP BY terms.termID, terms.term, terms.definition, terms.partOfSpeech, terms.parentTermID, termsParent.term, termCategories.termCategoryID, termCategories.termCategory, chapter, quotation, titles.titleID, titles.titleName, titles.titleSort, titles.titleURL, titles.authorFirstName, titles.authorLastName, titles.submissionDate, titles.publicationDate, titles.imageName, titles.categoryID, titles.shortDescription, titles.urlPKDWeb ORDER BY termID, titleID, chapter`;

  // console.log(`${ controllerName } - controller`, getDateTime(), "get /:termID sqlQuery", sqlQuery);

  // db.select(checklistColumnsList)
  //   .from(tableName)
  //   .leftOuterJoin("userReviews", "userReviews.termID", "terms.termID")
  //   // .leftOuterJoin("users", "users.userID", "userReviews.userID")
  //   .leftOuterJoin("categories", "categories.categoryID", "terms.categoryID")
  //   // .leftOuterJoin("editions", "editions.termID", "terms.termID")
  //   // .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
  //   // .where("users.userID", userID)
  //   // .where("userReviews.userID", userID)
  //   .where(function () { this.where("userReviews.userID", userID).orWhereNull("userReviews.userID"); })
  //   // .where("userID", userID)
  //   // .where(activeChecklist)
  //   .where(function () { this.where("userReviews.active", 1).orWhereNull("userReviews.active"); })
  //   .where({ "terms.active": true, "categories.active": true })
  //   // .where("editions.active", true)
  //   // .where("media.active", true)
  //   .orderBy(orderByDynamic)

  db.raw(sqlQuery)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${ controllerName } - controller`, getDateTime(), "get /:termID records[0]", records[0]);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records[0] });

      } else {
        // console.log(`${ controllerName } - controller`, getDateTime(), "get /:termID No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(componentName, getDateTime(), "get /:termID error", error);

      addErrorLog(componentName, "get /:termID", { termID: termID }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


module.exports = router;