require("dotenv").config();

const express = require("express");
const app = express();


// const user = require("./controllers/user-controller");
// const userReview = require("./controllers/userReview-controller");
// const title = require("./controllers/title-controller");
// const edition = require("./controllers/edition-controller");
// const media = require("./controllers/media-controller");
// const category = require("./controllers/category-controller");

const users = require("./controllers/users-controller");
const userReviews = require("./controllers/userReviews-controller");
const titles = require("./controllers/titles-controller");
const editions = require("./controllers/editions-controller");
const media = require("./controllers/media-controller");
const categories = require("./controllers/categories-controller");

// const error = require("./controllers/error-controller");
// const errors = require("./controllers/errors-controller");

const fromthehomeopape = require("./controllers/fromthehomeopape-controller");

app.use(express.json());

app.use(require("./middleware/headers"));

// app.use("/user", user);
// app.use("/userreview", userReview);
// app.use("/title", title);
// app.use("/edition", edition);
// app.use("/media", media);
// app.use("/category", category);

app.use("/users", users);
app.use("/userreviews", userReviews);
app.use("/titles", titles);
app.use("/editions", editions);
app.use("/media", media);
app.use("/categories", categories);

// app.use("/error", error);
// app.use("/errors", errors);

app.use("/fromthehomeopape", fromthehomeopape);


app.listen(process.env.PORT || 4000, function () {
  console.log(`App is listening on port ${process.env.PORT}`);
}
);
