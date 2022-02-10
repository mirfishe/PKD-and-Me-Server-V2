"use strict";

// const componentName = "sharedFunctions";

const isEmpty = (value) => {
  // console.log(componentName, getDateTime(), "isEmpty value", value);

  // * https://stackoverflow.com/questions/4597900/checking-something-isempty-in-javascript -- 03/06/2021 MF
  // * https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in -- 03/06/2021 MF

  // const isEmpty = (object) => {

  //   for (var key in object) {

  //     if (object.hasOwnProperty(key)) {

  //         return false;

  //     };

  //   };

  //   return true;

  // };

  // return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.toString().trim().length === 0);
  return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

  // * Returns true -- 03/06/2021 MF
  // console.log(componentName, getDateTime(), "isEmpty(\"\")", isEmpty(""));
  // console.log(componentName, getDateTime(), "isEmpty(null)", isEmpty(null));
  // console.log(componentName, getDateTime(), "isEmpty(undefined)", isEmpty(undefined));
  // console.log(componentName, getDateTime(), "isEmpty([])", isEmpty([]));
  // console.log(componentName, getDateTime(), "isEmpty({})", isEmpty({}));

  // * Returns false -- 03/06/2021 MF
  // console.log(componentName, getDateTime(), "isEmpty(\"test\")", isEmpty("test"));
  // console.log(componentName, getDateTime(), "isEmpty(5)", isEmpty(5));
  // console.log(componentName, getDateTime(), "isEmpty(true)", isEmpty(true));
  // console.log(componentName, getDateTime(), "isEmpty([\"test\"])", isEmpty(["test"]));
  // console.log(componentName, getDateTime(), "isEmpty({test: \"test\"})", isEmpty({ test: "test" }));

};


const getDateTime = () => {
  // console.log("getDateTime");
  // console.log("getDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \" \")", new Date().toISOString().slice(0, 19).replace("T", " "));
  // console.log("getDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \"\")", new Date().toISOString().slice(0, 19).replace("T", ""));
  // console.log("getDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \" \")", new Date().toLocaleString().slice(0, 19).replace("T", " "));
  // console.log("getDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \"\")", new Date().toLocaleString().slice(0, 19).replace("T", ""));

  // * Time returned does not consider the time zone without adjustments. -- 08/09/2021 MF
  // * https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes -- 08/09/2021 MF

  // * https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local -- 08/09/2021 MF
  let timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  // return new Date().toLocaleString();
  // return new Date().toLocaleString().slice(0, 19).replace("T", " ");
  // return new Date().toISOString().slice(0, 19).replace("T", " ");
  return new Date(new Date() - timezoneOffset).toISOString().slice(0, 19).replace("T", " ");

};


const tryParseJSON = (jsonString) => {
  // console.log(componentName, getDateTime(), "tryParseJSON jsonString", jsonString);

  // * https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try -- 06/24/2021 MF
  try {

    let jsonData = JSON.parse(jsonString);

    // * Handle non-exception-throwing cases: -- 03/05/2021
    // * Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking, -- 03/05/2021
    // * but... JSON.parse(null) returns null, and typeof null === "object",  -- 03/05/2021
    // * so we must check for that, too. Thankfully, null is falsey, so this suffices: -- 03/05/2021
    if (jsonData && typeof jsonData === "object") {

      return jsonData;

    };
  }
  catch (error) {
    // ! Don't display this error in the console. This function is already returning false is the JSON file is not in the correct format. -- 06/24/2021 MF
    // console.log(componentName, getDateTime(), "tryParseJSON error", error);
  };

  return false;

};


const formatLowerCase = (value) => {
  // console.log(componentName, getDateTime(), "formatLowerCase value", value);

  let lowerCaseValue = value;

  if (isEmpty(value) === false) {

    lowerCaseValue = value.toString().toLowerCase();

  };

  return lowerCaseValue;

};


const formatUpperCase = (value) => {
  // console.log(componentName, getDateTime(), "formatUpperCase value", value);

  let upperCaseValue = value;

  if (isEmpty(value) === false) {

    upperCaseValue = value.toString().toUpperCase();

  };

  return upperCaseValue;

};


const formatTrim = (value) => {
  // console.log(componentName, getDateTime(), "formatTrim value", value);

  let trimValue = value;

  if (isEmpty(value) === false) {

    trimValue = value.toString().trim();

  };

  return trimValue;

};


const formatToString = (value) => {
  // console.log(componentName, getDateTime(), "formatToString value", value);

  let toStringValue = value;

  if (isEmpty(value) === false) {

    toStringValue = value.toString();

  };

  return toStringValue;

};


const formatSearchInput = (value) => {
  // console.log(componentName, getDateTime(), "formatSearchInput value", value);

  let formatedSearchInput = value;

  if (isEmpty(value) === false) {

    formatedSearchInput = formatTrim(value).toLowerCase();

  };

  return formatedSearchInput;

};


exports.isEmpty = isEmpty;
exports.getDateTime = getDateTime;
exports.tryParseJSON = tryParseJSON;
exports.formatLowerCase = formatLowerCase;
exports.formatUpperCase = formatUpperCase;
exports.formatTrim = formatTrim;
exports.formatToString = formatToString;
exports.formatSearchInput = formatSearchInput;
