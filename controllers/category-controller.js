const router = require("express").Router();
const dbConfig = require("../db");
const db = require('knex')(dbConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");

/******************************
 ***** Get Category List *********
 ******************************/
// * Returns all categories active or not
router.get("/list", (req, res) => {

  db.select("*")
    .from("categories")
    .orderBy("sortID")
    .then((categories) => {
      if (categories.length > 0) {
        // console.log("category-controller get / categories", categories);
        res.status(200).json({ categories: categories, resultsFound: true, message: "Successfully retrieved categories." });
      } else {
        // console.log("category-controller get / No Results");
        // res.status(200).send("No categories found.");
        // res.status(200).send({resultsFound: false, message: "No categories found."})
        res.status(200).json({ resultsFound: false, message: "No categories found." });
      };
    })
    .catch((err) => {
      console.log("category-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No categories found.", error: err });
    });

});

/******************************
 ***** Get Categories *********
 ******************************/
// * Only returns categories that have titles linked to them
// * Need to return all categories that are active for the add title function
router.get("/", (req, res) => {

  db.select("*")
    .from("categories")
    .where({ active: true })
    .orderBy("sortID")
    .then((categories) => {
      if (categories.length > 0) {
        // console.log("category-controller get / categories", categories);
        res.status(200).json({ categories: categories, resultsFound: true, message: "Successfully retrieved categories." });
      } else {
        // console.log("category-controller get / No Results");
        // res.status(200).send("No categories found.");
        // res.status(200).send({resultsFound: false, message: "No categories found."})
        res.status(200).json({ resultsFound: false, message: "No categories found." });
      };
    })
    .catch((err) => {
      console.log("category-controller get / err", err);
      res.status(500).json({ resultsFound: false, message: "No categories found.", error: err });
    });

});

module.exports = router;