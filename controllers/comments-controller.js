"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, formatTrim } = require("../utilities/sharedFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "comments";
const tableName = "comments";
const select = "*";
const orderBy = [{ column: "dateEntered", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


/******************************
 ***** Get Comments *********
 ******************************/
router.get("/", validateAdmin, (request, response) => {

  db.select(select)
    .from(tableName)
    .leftOuterJoin("users", "users.userID", "comments.userID")
    .orderBy(orderBy)
    .then((records) => {

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
 ***** Get Comment By commentID *****
***************************************/
// router.get("/:commentID", validateAdmin, (request, response) => {

//   // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

// let commentID = isEmpty(request.params.commentID) === false ? request.params.commentID : "";

//   if (isNaN(formatTrim(commentID)) === true) {

//     commentID = 0;

//   } else {

//     commentID = parseInt(commentID);

//   };

//   const where = { commentID: commentID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .then((records) => {

//       if (isEmpty(records) === false) {
//         // console.log(componentName, getDateTime(), `get /:commentID ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(componentName, getDateTime(), "get /:commentID No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(componentName, getDateTime(), "get /:commentID error", error);

//       addErrorLog(componentName, "get /:commentID", { "commentID": commentID }, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Comment ***************
*********************************/
router.post("/", /* validateSession, */(request, response) => {

  // // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  // let userID = isEmpty(request.params.userID) === false ? request.params.userID : "";

  // if (isNaN(formatTrim(userID)) === true) {

  //   userID = 0;

  // } else {

  //   userID = parseInt(userID);

  // };

  const recordObject = {
    // userID: .userID,
    userID: request.body.recordObject.userID,
    email: request.body.recordObject.email,
    comment: request.body.recordObject.comment
    // dateEntered: request.body.recordObject.dateEntered
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning("*")
    .insert(recordObject)
    .then((records) => {
      // console.log(componentName, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF -- 08/13/2021 MF

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

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


module.exports = router;