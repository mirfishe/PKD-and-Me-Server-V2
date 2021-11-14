"use strict";

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
const errors = require("./controllers/errors-controller");
// const comment = require("./controllers/comment-controller");
const comments = require("./controllers/comments-controller");
// const titleSuggestion = require("./controllers/titleSuggestion-controller");
const titleSuggestions = require("./controllers/titleSuggestions-controller");

const fromthehomeopape = require("./controllers/fromthehomeopape-controller");

app.use(express.json());

// * Configured the server to handle the CORS requests instead of the code because just having this here wasn't working. -- 08/13/2021 MF
// ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
// * This will work in development and won't affect production even though pm2 doesn't see this .env variable, because it would be equal to undefined in production. -- 08/13/2021 MF
if (process.env.NODE_ENV === "development") {
  app.use(require("./middleware/headers"));
};

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
app.use("/errors", errors);
// app.use("/comment", comment);
app.use("/comments", comments);
// app.use("/titleSuggestion", titleSuggestion);
app.use("/titleSuggestions", titleSuggestions);

app.use("/fromthehomeopape", fromthehomeopape);


// ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
app.listen(process.env.PORT || 4000, function () {
  console.log(`App is listening on port ${process.env.PORT}`);
}
);
