"use strict";

require("dotenv").config();

const express = require("express");
const app = express();

const test = require("./controllers/test-controller");

const users = require("./controllers/users-controller");
const userReviews = require("./controllers/userReviews-controller");
const titles = require("./controllers/titles-controller");
const editions = require("./controllers/editions-controller");
const media = require("./controllers/media-controller");
const categories = require("./controllers/categories-controller");

const logs = require("./controllers/logs-controller");
const errors = require("./controllers/errors-controller");
const comments = require("./controllers/comments-controller");
const titleSuggestions = require("./controllers/titleSuggestions-controller");

const terms = require("./controllers/terms-controller");

const fromthehomeopape = require("./controllers/fromthehomeopape-controller");

const amazon = require("./controllers/amazon-controller");

const computerLogs = require("./controllers/computerLogs-controller");

app.use(express.json());

// * Configured the server to handle the CORS requests instead of the code because just having this here wasn't working. -- 08/13/2021 MF
// ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
// * This will work in development and won't affect production even though pm2 doesn't see this .env variable, because it would be equal to undefined in production. -- 08/13/2021 MF
if (process.env.NODE_ENV === "development") {

  app.use(require("./middleware/headers"));

};

app.use("/test", test);

app.use("/users", users);
app.use("/userreviews", userReviews);
app.use("/titles", titles);
app.use("/editions", editions);
app.use("/media", media);
app.use("/categories", categories);

app.use("/logs", logs);
app.use("/errors", errors);
app.use("/comments", comments);
app.use("/titleSuggestions", titleSuggestions);

app.use("/terms", terms);

app.use("/fromthehomeopape", fromthehomeopape);

app.use("/amazon", amazon);

app.use("/computerLogs", computerLogs);


// ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF
app.listen(process.env.PORT || 4000, function () {

  console.log(`App is listening on port ${process.env.PORT}`);

});
