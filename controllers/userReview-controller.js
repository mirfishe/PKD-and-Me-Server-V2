const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const controllerName = "userReview";
const tableName = "userReviews";
const select = "*";
const orderBy = [{ column: "updatedAt", order: "desc" }];


// ! Function doesn't work because it needs to wait on the results of the query
// function hasReviewedTitle (userID, titleID) {

//     const query = {where: {
//         [Op.and]: [
//         {userID: {[Op.eq]: userID}},
//         {titleID: {[Op.eq]: titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((userReviews) => {
//         if (userReviews.length > 0) {
//             // console.log(controllerName + "-controller get /user/:userID/title/:titleID userReviews", userReviews);
//             // res.status(200).json({userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "."});
//             // console.log(controllerName + "-controller hasReviewedTitle", true);
//             return {hasReviewedTitle: true, resultsFound: true, message: "Successfully retrieved " + tableName + "."};
//         } else {
//             // console.log(controllerName + "-controller get /user/:userID/title/:titleID No Results");
//             // res.status(200).json({resultsFound: false, message: "No " + tableName + " found."});
//             // console.log(controllerName + "-controller hasReviewedTitle", false);
//             return {hasReviewedTitle: false, resultsFound: false, message: "No " + tableName + " found."};
//         };
//     })
//     .catch((err) => {
//         console.log(controllerName + "-controller hasReviewedTitle err", err);
//         // res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         return {hasReviewedTitle: false, resultsFound: false, message: "An error occurred.", error: err};
//     });

// };


/******************************
 ***** Get User Review List *********
 ******************************/
router.get("/list", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    // .where("titles.active", true)
    // .where("userReviews.active", true)
    // .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {

      if (userReviews.length > 0) {

        // console.log(controllerName + "-controller get /list userReviews", userReviews);
        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /list No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /list err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/******************************
 ***** Get User Reviews *********
 ******************************/
router.get("/", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {

      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get / userReviews", userReviews);

        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get / No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get User Review By ReviewID *****
***************************************/
router.get("/:reviewID", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .where("userReviews.reviewID", req.params.reviewID)
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {

      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID userReviews", userReviews);

        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });
        // res.status(200).json({
        // reviewID:   userReview.reviewID,
        // userID:     userReview.userID,
        // updatedBy:  userReview.updatedBy,
        // titleID:    userReview.titleID,
        // read:       userReview.read,
        // dateRead:   userReview.dateRead,
        // rating:     userReview.rating,
        // shortReview:   userReview.shortReview,
        // longReview:   userReview.longReview,
        // active:     userReview.active,
        // message:    "Successfully retrieved user review information."
        // });

      } else {
        // console.log(controllerName + "-controller get /:" + controllerName + "ID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /:" + controllerName + "ID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get Total Average Rating By TitleID *****
***************************************/
// * Gets the overall rating for the title
// router.get("/rating/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.findAll(query)
//     .then((userReview) => res.status(200).json({
//         titleID:    userReview.titleID,
//         overallRating:     userReview.overallRating,
//         message:    "Successfully retrieved user overall rating."
//         }))
//         .catch((err) => {
//             console.log(controllerName + "-controller get /rating/:titleID err", err);
//             res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//         });

// });


/**************************************
 ***** Get User Review Count Rating By TitleID *****
***************************************/
// * Gets the user review count for the title
// * Don't need because the count comes back with the get user reviews by titleID
// router.get("/count/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.count(query)
//     .then((userReview) => {
//         // console.log(controllerName + "-controller get /count/:titleID userReview", userReview);
//         res.status(200).json({
//         userReviewCount:    userReview,
//         message:    "Successfully retrieved user review count."});
//     })
//     .catch((err) => {
//         console.log(controllerName + "-controller get /count/:titleID err", err);
//         res.status(500).json({resultsFound: false, message: "No " + tableName + " found.", error: err});
//     });

// });


/**************************************
 ***** Get User Review Rating Sum By TitleID *****
***************************************/
// * Gets the sum of ratings for the title
// * Don't need since the rating endpoint is working
// router.get("/sum/:titleID", (req, res) => {

//     const query = {where: {
//         [Op.and]: [
//         {titleID: {[Op.eq]: req.params.titleID}},
//         {active: {[Op.eq]: true}}
//         ]
//     }};

//     UserReview.sum("rating", query)
//     .then((userRatingSum) => {
//         if (!isNaN(userRatingSum)) {
//             // console.log(controllerName + "-controller get /sum/:titleID userRatingSum", userRatingSum);
//             res.status(200).json({
//                 userRatingSum:    userRatingSum,
//                 resultsFound: true,
//                 message:    "Successfully retrieved user review sum."
//             });
//         } else {
//             // console.log(controllerName + "-controller get /sum/:titleID userRatingSum", userRatingSum);
//             // res.status(200).json({resultsFound: false, message: "There are no user ratings."});
//             res.status(200).json({
//                 userRatingSum:    0,
//                 // resultsFound: true,
//                 resultsFound: false,
//                 message:    "There are no user ratings."
//             });
//         };
//     })
//     .catch((err) => {
//         console.log(controllerName + "-controller get /sum/:titleID err", err);
//         res.status(500).json({resultsFound: false, message: "Did not successfully retrieved user review sum.", error: err});
//     });

// });


/**************************************
 ***** Get User Review Rating List *****
***************************************/
// * Gets the sum and count of ratings for the title
router.get("/rating/list", (req, res) => {

  const query = {
    where: {
      [Op.and]: [
        // {titleID: {[Op.eq]: req.params.titleID}},
        { rating: { [Op.ne]: 0 } },
        { rating: { [Op.not]: null } },
        { active: { [Op.eq]: true } }
      ]
    },
    group: ["titleID"],
    attributes: [
      // Sequelize.col("titleID"),
      [Sequelize.col("titleID"), "titleID"],
      [Sequelize.fn("count", Sequelize.col("rating")), "userReviewCount"],
      [Sequelize.fn("sum", Sequelize.col("rating")), "userReviewSum"]
    ]
  };

  UserReview.findAll(query)
    .then((userReviews) => {
      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /rating/:titleID userReviews", userReviews);
        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved user ratings." });
      } else {
        // console.log(controllerName + "-controller get /rating/:titleID  No Results");
        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No user ratings found." });
      };
    })
    .catch((err) => {
      console.log(controllerName + "-controller get /rating/:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No user ratings found.", error: err });
    });

});


/**************************************
 ***** Get User Review Rating By TitleID *****
***************************************/
// * Gets the sum and count of ratings for the title
router.get("/rating/:titleID", (req, res) => {

  const query = {
    where: {
      [Op.and]: [
        { titleID: { [Op.eq]: req.params.titleID } },
        { rating: { [Op.ne]: 0 } },
        { rating: { [Op.not]: null } },
        { active: { [Op.eq]: true } }
      ]
      // }, group: ["rating"]
    }, attributes: [
      [Sequelize.fn("count", Sequelize.col("rating")), "userReviewCount"],
      [Sequelize.fn("sum", Sequelize.col("rating")), "userReviewSum"]
    ]
  };

  UserReview.findAll(query)
    .then((userReviews) => {
      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /rating/:titleID userReviews", userReviews);
        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved user ratings." });
      } else {
        // console.log(controllerName + "-controller get /rating/:titleID  No Results");
        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No user ratings found." });
      };
    })
    .catch((err) => {
      console.log(controllerName + "-controller get /rating/:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No user ratings found.", error: err });
    });

});


/**************************************
 ***** Get User Reviews By TitleID *****
***************************************/
// * Gets all user reviews by TitleID and the count
// TODO: Would like to add the overall rating for the title
router.get("/title/:titleID", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .where("titles.titleID", req.params.titleID)
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {
      // console.log(controllerName + "-controller get /title/:titleID userReviews", userReviews);

      // if (userReviews.rows.length > 0) {
      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /title/:titleID userReviews", userReviews);

        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /title/:titleID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /title/:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get User Reviews By UserID *****
***************************************/
router.get("/user/:userID", (req, res) => {

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .where("users.userID", req.params.userID)
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {

      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /user/:userID" userReviews", userReviews);

        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /user/:userID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /user/:userID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/**************************************
 ***** Get User Reviews By UserID and TitleID *****
***************************************/
// * Don't need because the front end restricts user reviews to one per title
router.get("/user/:userID/title/:titleID", (req, res) => {

  // ! Function doesn't work because it needs to wait on the results of the query
  // console.log("hasReviewedTitle", hasReviewedTitle(req.params.userID, req.params.titleID));

  // ! ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"]

  db.select(select)
    .from(tableName)
    .leftOuterJoin("titles", "titles.reviewID", "userReviews.reviewID")
    .leftOuterJoin("users", "users.userID", "userReviews.userID")
    .where("users.userID", req.params.userID)
    .where("titles.titleID", req.params.titleID)
    .where("titles.active", true)
    .where("userReviews.active", true)
    .where("users.active", true)
    .orderBy(orderBy)
    .then((userReviews) => {

      if (userReviews.length > 0) {
        // console.log(controllerName + "-controller get /user/:userID/title/:titleID userReviews", userReviews);

        res.status(200).json({ userReviews: userReviews, resultsFound: true, message: "Successfully retrieved " + tableName + "." });

      } else {
        // console.log(controllerName + "-controller get /user/:userID/title/:titleID No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((err) => {
      console.log(controllerName + "-controller get /user/:userID/title/:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: err });
    });

});


/* ******************************
 *** Add User Review  ***************
*********************************/
// * Allows a user to add a new user review
router.post("/", validateSession, (req, res) => {

  const recordObject = {
    userID: req.user.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview
  };

  db(tableName)
    .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller post / records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller post / records", records);

        res.status(200).json({ records: records, recordAdded: true, message: "Successfully created " + tableName + "." });

      } else {
        console.log(controllerName + "-controller post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordAdded: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller post / error", error);
      res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
// * Allows the user to update the user review including soft delete it
router.put("/:reviewID", validateSession, (req, res) => {

  const recordObject = {
    userID: req.user.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview,
    active: req.body.userReview.active
  };

  const where = { reviewID: req.params.reviewID, userID: req.user.userID };

  db(tableName)
    .where(where)
    .returning(select)
    .update(recordObject)
    .then((records) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordUpdated: true, message: "Successfully updated " + tableName + "." });

      } else {
        console.log(controllerName + "-controller put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordUpdated: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID error", error);
      res.status(500).json({ recordUpdated: false, message: "Not successfully updated " + tableName + ".", error: error });
    });

});


/***************************
 ******* Update User Review  *******
 ***************************/
// * Allows the admin to update the user review including soft delete it
router.put("/admin/:reviewID", validateAdmin, (req, res) => {

  const recordObject = {
    userID: req.body.userReview.userID,
    updatedBy: req.user.userID,
    titleID: req.body.userReview.titleID,
    read: req.body.userReview.read,
    dateRead: req.body.userReview.dateRead,
    rating: req.body.userReview.rating,
    shortReview: req.body.userReview.shortReview,
    longReview: req.body.userReview.longReview,
    active: req.body.userReview.active
  };

  const where = { reviewID: req.params.reviewID };

  db(tableName)
    .where(where)
    .returning(select)
    .update(recordObject)
    .then((records) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller put /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordUpdated: true, message: "Successfully updated " + tableName + "." });

      } else {
        console.log(controllerName + "-controller put /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordUpdated: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller put /:" + controllerName + "ID error", error);
      res.status(500).json({ recordUpdated: false, message: "Not successfully updated " + tableName + ".", error: error });
    });

});


/***************************
 ******* Delete User Review *******
 ***************************/
// * Allows an admin to hard delete a review
router.delete("/:reviewID", validateAdmin, (req, res) => {

  const where = { reviewID: req.params.reviewID };

  db(tableName)
    .where(where)
    .returning(select)
    .del()
    .then((records) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

      if (records.length > 0) {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID records", records);

        res.status(200).json({ records: records, recordDeleted: true, message: "Successfully deleted " + tableName + "." });

      } else {
        console.log(controllerName + "-controller delete /:" + controllerName + "ID No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ records: records, recordDeleted: false, message: "Nothing to delete." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller delete /:" + controllerName + "ID error", error);
      res.status(500).json({ recordDeleted: false, message: "Not successfully deleted " + tableName + ".", error: error });
    });

});


module.exports = router;