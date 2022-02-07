"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "media";
const tableName = "media";
const select = "*";
const orderBy = [{ column: "sortID", order: "asc" }];

let records;


/******************************
 ***** Get Media *********
 ******************************/
// * Returns all media active or not -- 03/28/2021 MF
// router.get("/list", (request, response) => {
router.get("/", (request, response) => {

  db.select(select)
    .from(tableName)
    .orderBy(orderBy)
    // .then((records) => {

    // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
    //   if (process.env.DATABASE_DIALECT == "mysql") {

    //     return convertBitTrueFalse(records);

    //   } else {

    //     return records;

    //   };

    // })
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get / No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get Media *********
 ******************************/
// router.get("/", (request, response) => {

//   const where = { active: true };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, getDateTime(), "get / No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(`${controllerName}-controller`, getDateTime(), "get / error", error);

//       addErrorLog(`${controllerName}-controller`, "get /:mediaID", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/******************************
 ***** Get Media Admin *********
 ******************************/
// * Return all categories to adminster them -- 03/28/2021 MF
// router.get("/admin", validateAdmin, (request, response) => {

//   db.select(select)
//     .from(tableName)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (isEmpty(records) === false) {
//         // console.log(`${controllerName}-controller`, getDateTime(), `get /admin ${tableName}`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, getDateTime(), "get /admin No Results");

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(`${controllerName}-controller`, getDateTime(), "get /admin error", error);

//       addErrorLog(`${controllerName}-controller`, "get /admin", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/**************************************
 ***** Get Media By MediaID *****
***************************************/
// router.get("/:mediaID", (request, response) => {

//   const where = { mediaID: request.params.mediaID };

//   db.select(select)
//     .from(tableName)
//     .where(where)
//     .orderBy(orderBy)
//     .then((records) => {
//       // console.log(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID records`, records);

//       records = convertBitTrueFalse(records);

//       // ! If statement doesn't get the value to check because the code goes to the .catch block when the results are null using findOne. -- 05/24/2021 MF
//       // if (records === null) {
//       if (isEmpty(records) === false) {
//         // console.log(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID records`, records);

//         response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });
//         // response.status(200).json({
//         //     media:   records.media,
//         //     sortID:     records.sortID,
//         //     active:     records.active,
//         //     message:    `Successfully retrieved ${tableName} information.`
//         //     });

//       } else {
//         // console.log(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

//         response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

//       };

//     })
//     .catch((error) => {
//       console.error(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(`${controllerName}-controller`, "get /:media", records, error);
//       response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

//     });

// });


/* ******************************
 *** Add Media ***************
*********************************/
// * Allows an admin to add a new media -- 03/28/2021 MF
router.post("/", validateAdmin, (request, response) => {

  // ! Don't need this anymore; was trying to fix scoping issues -- 03/28/2021 MF
  // let newSortID = 0;

  // * Moved this inside the function for scoping issues with newSortID -- 03/28/2021 MF
  // const createMedia = {
  //     media:      request.body.media.media,
  //     sortID:     newSortID
  //   };

  db.queryBuilder()
    .from(tableName)
    .max("sortID")
    .first() // * Add this to get an object. -- 05/06/2021 MF
    .then((maxSortID) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "maxSortID", maxSortID);

      if (isNaN(maxSortID)) {

        // newSortID = 1;
        return 1;

      } else {

        // newSortID = maxSortID + 1;
        return maxSortID + 1;

      };

    })
    .then((newSortID) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "newSortID", newSortID);

      const recordObject = {
        media: request.body.media.media,
        electronic: request.body.media.electronic,
        sortID: newSortID
      };

      return db(tableName)
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(recordObject);

    })
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Update Media *******
 ***************************/
// * Allows an admin to update the media including soft delete it -- 03/28/2021 MF
router.put("/:mediaID", validateAdmin, (request, response) => {

  const where = { mediaID: request.params.mediaID };

  const recordObject = {
    media: request.body.media.media,
    sortID: request.body.media.sortID,
    active: request.body.media.active
  };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /:${controllerName}ID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /:${controllerName}ID records`, records);

        response.status(200).json({ primaryKeyID: request.params.mediaID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /:${controllerName}ID No Results`);

        response.status(200).json({ primaryKeyID: request.params.mediaID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `put /:${controllerName}ID`, records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Delete Media *******
 ***************************/
// * Allows an admin to hard delete the media -- 03/28/2021 MF
router.delete("/:mediaID", validateAdmin, (request, response) => {

  const where = { mediaID: request.params.mediaID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .del()
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ primaryKeyID: request.params.mediaID, transactionSuccess: true, errorOccurred: false, message: "Successfully deleted.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `delete /:${controllerName}ID No Results`);

        response.status(200).json({ primaryKeyID: request.params.mediaID, transactionSuccess: false, errorOccurred: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `delete /:${controllerName}ID`, records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully deleted." });

    });

});


module.exports = router;