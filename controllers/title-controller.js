const router = require("express").Router();
const Title = require("../db").import("../models/title");
const Category = require("../db").import("../models/category");
const Edition = require('../db').import('../models/edition');
const Media = require("../db").import("../models/media");
const User = require("../db").import("../models/user");
const UserReview = require("../db").import("../models/userReview");
const { Op } = require("sequelize");
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Title List *********
 ******************************/
// * Returns all titles active or not
// * Just the title data and not the related tables data
router.get("/list", (req, res) => {

  const query = {/*where: {
        active: {[Op.eq]: true}
    },*/ include: [
      // {model: Edition,
      //     // right: true,
      //     required: false,
      //     include: [
      //         {model: Media, 
      //         // right: true,
      //         required: false,
      //         where: {
      //             active: {[Op.eq]: true}
      //         }}],
      //     where: {
      //         active: {[Op.eq]: true}
      //     }
      // },
      {
        model: Category,
        right: true,
        required: false,
        // where: {
        //     active: {[Op.eq]: true}
        // }
      }
    ],
    order: [["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get / titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get / No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/******************************
 ***** Get Titles *********
 ******************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/", (req, res) => {

  // const attributes = {
  //     attributes: [
  //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
  //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
  //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
  //     ]
  // };

  const query = {
    where: {
      active: { [Op.eq]: true }
      // }, include: [Category, Edition, UserReview], order: [["titleSort", "ASC"]]};
      // }, include: {all: true, nested: true}, order: [["titleSort", "ASC"]]};
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Edition,
        // right: true,
        required: false,
        include: [
          {
            model: Media,
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Category,
        right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get / titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get / No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/**************************************
 ***** Get Title By TitleID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/:titleID", (req, res) => {

  // const attributes = {
  //     attributes: [
  //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
  //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
  //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
  //     ]
  // };

  const query = {
    where: {
      titleID: { [Op.eq]: req.params.titleID }
      // }, include: {all: true, nested: true}};
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Edition,
        // right: true,
        required: false,
        include: [
          {
            model: Media,
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Category,
        right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ]
  };
  // * https://stackoverflow.com/questions/40202540/order-by-in-nested-eager-loading-in-sequelize-not-working
  // order: [[{model: Media, as: "medium"}, "sortID", "ASC"]]};

  // Title.findOne(query)
  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get /:titleID title", title);
        // res.status(200).json({
        // titleID:   title.titleID,
        // titleName:     title.titleName,
        // titleSort:  title.titleSort,
        // authorFirstName:   title.authorFirstName,
        // authorLastName:     title.authorLastName,
        // publicationDate:  title.publicationDate,
        // imageName:   title.imageName,
        // categoryID:   title.categoryID,
        // shortDescription:     title.shortDescription,
        // urlPKDweb:  title.urlPKDweb,
        // active:     title.active,
        // message:    "Successfully retrieved title."
        // });
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved title." });
      } else {
        // console.log("title-controller get /:titleID No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get /:titleID err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/**************************************
 ***** Get Titles By MediaID *****
***************************************/
// ? Needed? Use Get Editions instead?
// ! There is no column for mediaID in the titles table
// ! Query needs to be changed to work
// ? ADD OVERALL RATING TO GET TITLE?
// router.get("/media/:mediaID", (req, res) => {

//     // const attributes = {
//     //     attributes: [
//     //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
//     //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
//     //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
//     //     ]
//     // };

//     const query = {where: {
//         [Op.and]: [
//             {mediaID: {[Op.eq]: req.params.mediaID}},
//             {active: {[Op.eq]: true}}
//             ]
//     }, order: [["titleSort", "DESC"]]};

//     Title.findAll(query)
//     .then((titles) => {
//         // console.log("title-controller get /media/:mediaID" titles", titles);
//         res.status(200).json({titles: titles, message: "Successfully retrieved titles."});
//     })
//         .catch((err) => {
//             console.log("title-controller get /media/:mediaID err", err);
//             res.status(500).json({resultsFound: false, message: "No titles found.", error: err});
//         });

// });

/**************************************
 ***** Get Titles By CategoryID *****
***************************************/
// ? ADD OVERALL RATING TO GET TITLE?
router.get("/category/:categoryID/:sort?", (req, res) => {

  // const attributes = {
  //     attributes: [
  //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
  //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
  //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
  //     ]
  // };

  let orderBy = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderBy = "publicationDate";
  } else {
    orderBy = "titleSort";
  };

  const query = {
    where: {
      [Op.and]: [
        { categoryID: { [Op.eq]: req.params.categoryID } },
        { active: { [Op.eq]: true } }
      ]
      // }, include: {all: true, nested: true}, order: [["titleSort", "ASC"]]};
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Edition,
        // right: true,
        required: false,
        include: [
          {
            model: Media,
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          active: { [Op.eq]: true }
        }
      },
      {
        model: Category,
        right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [[orderBy, "ASC"], ["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get /category/:categoryID titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get /category/:categoryID No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get /category/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/**************************************
 ***** Get Titles By CategoryID Admin *****
***************************************/
// * Return all titles to adminster them
router.get("/admin/category/:categoryID/:sort?", validateAdmin, (req, res) => {

  let orderBy = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderBy = "publicationDate";
  } else {
    orderBy = "titleSort";
  };

  const query = {
    where: {
      categoryID: { [Op.eq]: req.params.categoryID }
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false
          }]
      },
      // {model: Edition,
      //     // right: true,
      //     required: false,
      //     include: [
      //         {model: Media, 
      //         // right: true,
      //         required: false
      //         }]
      // },
      {
        model: Category,
        right: true,
        required: false
      }
    ],
    order: [[orderBy, "ASC"], ["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get /category/:categoryID titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get /category/:categoryID No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get /category/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/**************************************
 ***** Get Titles/Checklist *****
***************************************/
router.get("/checklist/list", validateSession, (req, res) => {

  // const attributes = {
  //     attributes: [
  //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
  //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
  //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
  //     ]
  // };

  let orderBy = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderBy = "publicationDate";
  } else {
    orderBy = "titleSort";
  };

  const query = {
    where: {
      active: { [Op.eq]: true }
      // }, include: {all: true, nested: true}, order: [["titleSort", "ASC"]]};
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          userID: { [Op.eq]: req.user.userID },
          active: { [Op.eq]: true }
        }
      },
      {
        model: Category,
        right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [[orderBy, "ASC"], ["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get /checklist/:categoryID titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get /checklist/:categoryID No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get /checklist/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/**************************************
 ***** Get Titles/Checklist By CategoryID *****
***************************************/
router.get("/checklist/:categoryID/:sort?", validateSession, (req, res) => {

  // const attributes = {
  //     attributes: [
  //     "reviewID", "userID", "updatedBy", "titleID", "read", "dateRead:   userReviews.dateRead", "rating", "shortReview", "longReview", "active", 
  //     [sequelize.fn("count", sequelize.col("reviewID")), "userReviewCount"],
  //     [sequelize.fn("sum", sequelize.col("reviewID")), "userReviewSum"],
  //     ]
  // };

  let orderBy = "titleSort";

  if (req.params.sort == "publicationDate") {
    orderBy = "publicationDate";
  } else {
    orderBy = "titleSort";
  };

  const query = {
    where: {
      [Op.and]: [
        { categoryID: { [Op.eq]: req.params.categoryID } },
        { active: { [Op.eq]: true } }
      ]
      // }, include: {all: true, nested: true}, order: [["titleSort", "ASC"]]};
    }, include: [
      {
        model: UserReview,
        // right: true,
        required: false,
        include: [
          {
            model: User,
            attributes: ["userID", "firstName", "lastName", "email", "updatedBy", "admin", "active"],
            // right: true,
            required: false,
            where: {
              active: { [Op.eq]: true }
            }
          }],
        where: {
          userID: { [Op.eq]: req.user.userID },
          active: { [Op.eq]: true }
        }
      },
      {
        model: Category,
        right: true,
        required: false,
        where: {
          active: { [Op.eq]: true }
        }
      }
    ],
    order: [[orderBy, "ASC"], ["titleSort", "ASC"]]
  };

  Title.findAll(query)
    .then((titles) => {
      if (titles.length > 0) {
        // console.log("title-controller get /checklist/:categoryID titles", titles);
        res.status(200).json({ titles: titles, resultsFound: true, message: "Successfully retrieved titles." });
      } else {
        // console.log("title-controller get /checklist/:categoryID No Results");
        // res.status(200).send("No titles found.");
        // res.status(200).send({resultsFound: false, message: "No titles found."})
        res.status(200).json({ resultsFound: false, message: "No titles found." });
      };
    })
    .catch((err) => {
      console.log("title-controller get /checklist/:categoryID err", err);
      res.status(500).json({ resultsFound: false, message: "No titles found.", error: err });
    });

});

/* ******************************
 *** Add Title ***************
*********************************/
// * Allows an admin to add a new title
router.post("/", validateAdmin, (req, res) => {

  const createTitle = {
    titleName: req.body.title.titleName,
    titleSort: req.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: req.body.title.titleURL,
    authorFirstName: req.body.title.authorFirstName,
    authorLastName: req.body.title.authorLastName,
    publicationDate: req.body.title.publicationDate,
    imageName: req.body.title.imageName,
    categoryID: req.body.title.categoryID,
    shortDescription: req.body.title.shortDescription,
    urlPKDweb: req.body.title.urlPKDweb
  };

  Title.create(createTitle)
    .then((title) => {
      // console.log("title-controller post / title", title);
      res.status(200).json({
        titleID: title.titleID,
        titleName: title.titleName,
        titleSort: title.titleSort,
        titleURL: title.titleURL,
        authorFirstName: title.authorFirstName,
        authorLastName: title.authorLastName,
        publicationDate: title.publicationDate,
        imageName: title.imageName,
        categoryID: title.categoryID,
        shortDescription: title.shortDescription,
        urlPKDweb: title.urlPKDweb,
        active: title.active,
        createdAt: title.createdAt,
        updatedAt: title.updatedAt,
        recordAdded: true,
        message: "Title successfully created."
      });
    })
    .catch((err) => {
      console.log("title-controller post / err", err);
      res.status(500).json({ recordAdded: false, message: "Title not successfully created.", error: err });
    });

});

/***************************
 ******* Update Title *******
 ***************************/
// * Allows the admin to update the title including soft delete it
router.put("/:titleID", validateAdmin, (req, res) => {

  const updateTitle = {
    titleName: req.body.title.titleName,
    titleSort: req.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
    titleURL: req.body.title.titleURL,
    authorFirstName: req.body.title.authorFirstName,
    authorLastName: req.body.title.authorLastName,
    publicationDate: req.body.title.publicationDate,
    imageName: req.body.title.imageName,
    categoryID: req.body.title.categoryID,
    shortDescription: req.body.title.shortDescription,
    urlPKDweb: req.body.title.urlPKDweb,
    active: req.body.title.active
  };

  const query = {
    where: {
      titleID: { [Op.eq]: req.params.titleID }
    }
  };

  Title.update(updateTitle, query)
    // ! Doesn't return the values of the updated record; the value passed to the function is the number of records updated.
    // .then((title) => res.status(200).json({message: title + " title record(s) successfully updated."}))
    .then((title) => {
      if (title > 0) {
        res.status(200).json({
          titleID: parseInt(req.params.titleID), // * The parameter value is passed as a string unless converted
          titleName: req.body.title.titleName,
          titleSort: req.body.title.titleName.toLowerCase().replace(/^(an?|the) (.*)$/i, '$2, $1'),
          titleURL: req.body.title.titleURL,
          authorFirstName: req.body.title.authorFirstName,
          authorLastName: req.body.title.authorLastName,
          publicationDate: req.body.title.publicationDate,
          imageName: req.body.title.imageName,
          categoryID: req.body.title.categoryID,
          shortDescription: req.body.title.shortDescription,
          urlPKDweb: req.body.title.urlPKDweb,
          active: req.body.title.active,
          recordUpdated: true,
          // message:    "Title successfully updated."
          message: title + " title record(s) successfully updated."
        });
      } else {
        res.status(200).json({ recordUpdated: false, message: title + " title record(s) successfully updated." });
      };
    })
    .catch((err) => {
      console.log("title-controller put /:titleID err", err);
      res.status(500).json({ recordUpdated: false, message: "Title not successfully updated.", error: err });
    });

});

/***************************
 ******* Delete Title *******
 ***************************/
// * Allows an admin to hard delete a title
router.delete("/:titleID", validateAdmin, (req, res) => {

  const query = {
    where: {
      titleID: { [Op.eq]: req.params.titleID }
    }
  };

  Title.destroy(query)
    .then(() => res.status(200).json({ recordDeleted: true, message: "Title successfully deleted." }))
    .catch((err) => {
      console.log("title-controller delete /:titleID err", err);
      res.status(500).json({ recordDeleted: false, message: "Title not successfully deleted.", error: err });
    });

});

module.exports = router;