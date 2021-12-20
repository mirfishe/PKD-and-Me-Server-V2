"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime, convertBitTrueFalse } = require("../utilities/sharedFunctions");
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

//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, records);

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

//       addErrorLog(`${controllerName}-controller`, "get /:mediaID", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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

//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /admin ${tableName}`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), "get /admin No Results");

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), "get /admin error", error);

//       addErrorLog(`${controllerName}-controller`, "get /admin", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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
//       // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID records`, records);

//       records = convertBitTrueFalse(records);

//       // ! If statement doesn't get the value to check because the code goes to the .catch block when the results are null using findOne. -- 05/24/2021 MF
//       // if (records === null) {
//       if (records.length > 0) {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID records`, records);

//         response.status(200).json({ resultsFound: true, message: `Successfully retrieved ${tableName}.`, records: records });
//         // response.status(200).json({
//         //     media:   records.media,
//         //     sortID:     records.sortID,
//         //     active:     records.active,
//         //     message:    `Successfully retrieved ${tableName} information.`
//         //     });

//       } else {
//         // console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID ${tableName} No Results`);

//         // response.status(200).send(`No ${tableName} found.`);
//         // response.status(200).send({resultsFound: false, message: `No ${tableName} found.`})
//         response.status(200).json({ resultsFound: false, message: `No ${tableName} found.` });

//       };

//     })
//     .catch((error) => {
//       console.log(`${controllerName}-controller`, GetDateTime(), `get /:${controllerName}ID error`, error);

//       addErrorLog(`${controllerName}-controller`, "get /:media", records, error);
//       response.status(500).json({ resultsFound: false, message: `No ${tableName} found.`, error: error });

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

      // console.log(`${controllerName}-controller`, GetDateTime(), "maxSortID", maxSortID);
      if (isNaN(maxSortID)) {
        // newSortID = 1;
        return 1;
      } else {
        // newSortID = maxSortID + 1;
        return maxSortID + 1;
      };

    })
    .then((newSortID) => {
      // console.log(`${controllerName}-controller`, GetDateTime(), "newSortID", newSortID);

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
      // console.log(`${controllerName}-controller`, GetDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      recordObject.mediaID = records[0];

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
      // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);
      // * Returns the number of deleted records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID records`, records);

        response.status(200).json({ recordDeleted: true, message: `Successfully deleted ${tableName}.`, mediaID: request.params.mediaID });

      } else {
        // console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID No Results`);

        // response.status(200).send("No records found.");
        // response.status(200).send({resultsFound: false, message: "No records found."})
        response.status(200).json({ recordDeleted: false, message: "Nothing to delete.", mediaID: request.params.mediaID });

      };

    })
    .catch((error) => {
      console.log(`${controllerName}-controller`, GetDateTime(), `delete /:${controllerName}ID error`, error);

      addErrorLog(`${controllerName}-controller`, `delete /:${controllerName}ID`, records, error);
      response.status(500).json({ recordDeleted: false, message: `Not successfully deleted ${tableName}.`, error: error });

    });

});


module.exports = router;