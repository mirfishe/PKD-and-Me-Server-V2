const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const controllerName = "editions";
const tableName = "editions";
const select = "*";
const activeWhere = { "editions.active": true, "titles.active": true, "media.active": true };
const activeDataWhere = { "titles.active": true, "media.active": true };
const orderBy = [{ column: "editions.publicationDate", order: "desc" }];


// ! How does Knex handle the leftOuterJoin with two columns of the same name?:  active, publicationDate, imageName, sortID, updatedBy, createDate, updateDate
const columnsList = ["*", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "editions.active AS editionsActive", "editions.createDate AS editionsCreateDate", "editions.updateDate AS editionsUpdatedDate", "titles.active AS titlesActive", "titles.createDate AS titlesCreateDate", "titles.updateDate AS titlesUpdatedDate", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreateDate", "media.updateDate AS mediaUpdatedDate"];

/*
categories
("categoryID","category","categories.sortID AS categoriesSortID", "categories.active AS categoriesActive", "categories.createDate AS categoriesCreateDate", "categories.updateDate AS categoriesUpdatedDate")

editions
("editionID", "titleID", "mediaID", "editions.publicationDate AS editionsPublicationDate", "editions.imageName AS editionsImageName", "ASIN", "textLinkShort", "textLinkFull", "imageLinkSmall", "imageLinkMedium", "imageLinkLarge", "textImageLink", "editions.active AS editionsActive", "editions.createDate AS editionsCreateDate", "editions.updateDate AS editionsUpdatedDate")

media
("mediaID", "media", "electronic", "media.sortID AS mediaSortID", "media.active AS mediaActive", "media.createDate AS mediaCreateDate", "media.updateDate AS mediaUpdatedDate")

titles
("titleID", "titleName", "titleSort", "titleURL", "authorFirstName", "authorLastName", "titles.publicationDate AS titlesPublicationDate", "titles.imageName AS titlesImageName", "categoryID", "shortDescription", "urlPKDweb", "titles.active AS titlesActive", "titles.createDate AS titlesCreateDate", "titles.updateDate AS titlesUpdatedDate")

userreviews
("reviewID", "userID", "userreviews.updatedBy AS userreviewsUpdatedBy", "titleID", "read", "dateRead", "rating", "shortReview", "longReview", "userreviews.active AS userreviewsActive", "userreviews.createDate AS userreviewsCreateDate", "userreviews.updateDate AS userreviewsUpdatedDate")

users
("userID", "firstName", "lastName", "email", "password", "users.updatedBy AS usersUpdatedBy", "admin", "users.active AS usersActive", "users.createDate AS usersCreateDate", "users.updateDate AS usersUpdatedDate")
*/


/******************************
 ***** Get Editions *********
 ******************************/
// * Returns all editions active or not
// router.get("/list", (req, res) => {
router.get("/", (req, res) => {

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " get /list " + tableName, records);

        res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " get /list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " get /list error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/******************************
 ***** Get Editions *********
 ******************************/
// router.get("/", (req, res) => {

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

//   // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, sqlQuery);

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get / " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get / No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get / error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Edition By EditionID *****
***************************************/
// router.get("/:editionID", (req, res) => {

//   const where = { editionID: req.params.editionID };

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

//   // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, sqlQuery);

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

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });
//         // res.status(200).json({
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
//         // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Edition By ASIN *****
***************************************/
router.get("/ASIN/:ASIN", (req, res) => {

  const where = { ASIN: req.params.ASIN };

  db.select(columnsList)
    .from(tableName)
    .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
    .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
    .where(where)
    // .where("editions.active", true)
    .where(activeDataWhere)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID " + tableName, records);

        res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });
        // res.status(200).json({
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
        // console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " get /:" + controllerName + "ID error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/**************************************
 ***** Get Editions By TitleID *****
***************************************/
// router.get("/title/:titleID", (req, res) => {

//   const where = { "editions.titleID": req.params.titleID };

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /title/:titleID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Editions By MediaID *****
***************************************/
// router.get("/media/:mediaID", (req, res) => {

//   const where = { "editions.mediaID": req.params.mediaID };

//   db.select(select)
//     .from(tableName)
//     .leftOuterJoin("titles", "titles.titleID", "editions.titleID")
//     .leftOuterJoin("media", "media.mediaID", "editions.mediaID")
//     .where(where)
//     .where(activeWhere)
//     .orderBy(orderBy)
//     .then((records) => {

//       records = convertBitTrueFalse(records);

//       if (records.length > 0) {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /media/:mediaID " + tableName, records);

//         res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

//       } else {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /media/:mediaID No Results");

//         // res.status(200).send("No " + tableName + " found.");
//         // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
//         res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

//       };

//     })
//     .catch((error) => {
//       console.log(controllerName + "-controller", GetDateTime(), " get /media/:mediaID error", error);
//       res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
//     });

// });


/**************************************
 ***** Get Editions By CategoryID *****
***************************************/
// ? Needed? Use Get Titles instead?
// ! There is no column for categoryID in the editions table
// ! Query needs to be changed to work
// router.get("/category/:categoryID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//             {categoryID: {[Op.eq]: req.params.categoryID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["publicationDate", "DESC"]]};

//     Edition.findAll(query)
//     .then((records) => {
//         // console.log(controllerName + "-controller", GetDateTime(), " get /category/:categoryID " + tableName, records);
//         res.status(200).json({message: "Successfully retrieved " + tableName + ".", records: records });
//     })
//     .catch((error) => {
//         console.log(controllerName + "-controller", GetDateTime(), " get /category/:categoryID error", error);
//         res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//     });

// });


/* ******************************
 *** Add Edition ***************
*********************************/
// * Allows an admin to add a new edition
router.post("/", validateAdmin, (req, res) => {

  const recordObject = {
    titleID: req.body.edition.titleID,
    mediaID: req.body.edition.mediaID,
    publicationDate: req.body.edition.publicationDate,
    imageName: req.body.edition.imageName,
    ASIN: req.body.edition.ASIN,
    textLinkShort: req.body.edition.textLinkShort,
    textLinkFull: req.body.edition.textLinkFull,
    imageLinkSmall: req.body.edition.imageLinkSmall,
    imageLinkMedium: req.body.edition.imageLinkMedium,
    imageLinkLarge: req.body.edition.imageLinkLarge,
    textImageLink: req.body.edition.textImageLink
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
      // * Returns the ID value of the added record.

      // records = convertBitTrueFalse(records);

      recordObject.editionID = records;

      if (records > 0) {
        console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

        res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: [recordObject] });

      } else {
        console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
      // console.log(controllerName + "-controller", GetDateTime(), " post / error.name", error.name);
      // console.log(controllerName + "-controller", GetDateTime(), " post / error.errors[0].message", error.errors[0].message);

      let errorMessages = "";

      for (let i = 0; i < error.errors.length; i++) {
        //console.log(controllerName + "-controller", GetDateTime(), " post / error.errors[i].message", error.errors[i].message);

        if (i > 1) {
          errorMessages = errorMessages + ", ";
        };

        errorMessages = errorMessages + error.errors[i].message;

      };

      res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName + ".", errorMessages: errorMessages, error: error });

    });

});


/***************************
 ******* Update Edition *******
 ***************************/
// * Allows the admin to update the edition including soft delete it
router.put("/:editionID", validateAdmin, (req, res) => {

  const recordObject = {
    titleID: req.body.edition.titleID,
    mediaID: req.body.edition.mediaID,
    publicationDate: req.body.edition.publicationDate,
    imageName: req.body.edition.imageName,
    ASIN: req.body.edition.ASIN,
    textLinkShort: req.body.edition.textLinkShort,
    textLinkFull: req.body.edition.textLinkFull,
    imageLinkSmall: req.body.edition.imageLinkSmall,
    imageLinkMedium: req.body.edition.imageLinkMedium,
    imageLinkLarge: req.body.edition.imageLinkLarge,
    textImageLink: req.body.edition.textImageLink,
    active: req.body.edition.active
  };

  const where = { editionID: req.params.editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID records", records);
      // * Returns the number of updated records.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID records", records);

        res.status(200).json({ recordUpdated: true, message: "Successfully updated " + tableName + ".", records: [recordObject] });

      } else {
        console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordUpdated: false, message: "Nothing to update.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " put /:" + controllerName + "ID error", error);
      res.status(500).json({ recordUpdated: false, message: "Not successfully updated " + tableName + ".", error: error });
    });

});


/***************************
 ******* Delete Edition *******
 ***************************/
// * Allows an admin to hard delete an edition
router.delete("/:editionID", validateAdmin, (req, res) => {

  const where = { editionID: req.params.editionID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .del()
    .then((records) => {
      console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID records", records);
      // * Returns the number of deleted records.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID records", records);

        res.status(200).json({ recordDeleted: true, message: "Successfully deleted " + tableName + ".", editionID: req.params.editionID });

      } else {
        console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordDeleted: false, message: "Nothing to delete.", editionID: req.params.editionID });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;