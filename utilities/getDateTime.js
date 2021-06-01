
const IsEmpty = require("../utilities/isEmpty");

const componentName = "getDateTime.js";


module.exports = getDateTime = () => {
  // console.log("getDateTime");
  // console.log("getDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \" \")", new Date().toISOString().slice(0, 19).replace("T", " "));
  // console.log("getDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \"\")", new Date().toISOString().slice(0, 19).replace("T", ""));
  // console.log("getDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \" \")", new Date().toLocaleString().slice(0, 19).replace("T", " "));
  // console.log("getDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \"\")", new Date().toLocaleString().slice(0, 19).replace("T", ""));

  // ! Time returned does not consider the time zone.
  // TODO: Fix the time zone issue.
  // * https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes

  // return new Date().toLocaleString();
  return new Date().toISOString().slice(0, 19).replace("T", " ");
  // return new Date().toLocaleString().slice(0, 19).replace("T", " ");

};
