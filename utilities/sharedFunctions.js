"use strict";

// const componentName = "sharedFunctions";

const isEmpty = (value) => {

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

  // * Time returned does not consider the time zone without adjustments. -- 08/09/2021 MF
  // * https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes -- 08/09/2021 MF

  // * https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local -- 08/09/2021 MF
  let timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  // return new Date().toLocaleString();
  // return new Date().toLocaleString().slice(0, 19).replace("T", " ");
  // return new Date().toISOString().slice(0, 19).replace("T", " ");
  return new Date(new Date() - timezoneOffset).toISOString().slice(0, 19).replace("T", " ");

};


const isNonEmptyArray = (arrayItem) => {

  let nonEmptyArray = false;

  if (Array.isArray(arrayItem) === true && arrayItem.length > 0) {

    nonEmptyArray = true;

  };

  return nonEmptyArray;

};


const tryParseJSON = (jsonString) => {

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
    // console.error(componentName, getDateTime(), "tryParseJSON error", error);
  };

  return false;

};


const formatLowerCase = (value) => {

  let lowerCaseValue = "";

  if (isEmpty(value) === false) {

    lowerCaseValue = formatToString(value).toLowerCase();

  };

  return lowerCaseValue;

};


const formatUpperCase = (value) => {

  let upperCaseValue = "";

  if (isEmpty(value) === false) {

    upperCaseValue = formatToString(value).toUpperCase();

  };

  return upperCaseValue;

};


const formatTrim = (value) => {

  let trimValue = "";

  if (isEmpty(value) === false) {

    trimValue = formatToString(value).trim();

  };

  return trimValue;

};


const formatToString = (value) => {

  let toStringValue = "";

  if (isEmpty(value) === false) {

    toStringValue = value.toString();

  };

  return toStringValue;

};


const formatInt = (value) => {

  let formatedInt = "";

  if (isEmpty(value) === false) {

    formatedInt = parseInt(formatTrim(value.replaceAll(",", ""))).toLocaleString();

  };

  return formatedInt;

};


const formatFloat = (value) => {

  let formatedFloat = "";

  if (isEmpty(value) === false) {

    formatedFloat = parseFloat(formatTrim(value.replaceAll(",", ""))).toLocaleString();

  };

  return formatedFloat;

};


const formatSearchInput = (value) => {

  let formatedSearchInput = "";

  if (isEmpty(value) === false) {

    formatedSearchInput = formatTrim(value).toLowerCase();

  };

  return formatedSearchInput;

};


const removeNonAlphanumericCharacters = (text) => {

  // * Removes all characters that aren't letters, numbers, spaces or a period. -- 05/12/2022 MF

  let formatedText = "";

  if (isEmpty(text) === false) {

    formatedText = text.replace(/[^a-zA-Z0-9\. ]/g, "");

  };

  return formatedText;

};


// ! This is duplicated code shared-functions, convertJSONToSQL.js, convertJSONToSQLNewTemplate.js, convertJSONToSQLNewTemplate.js -- 06/14/2022 MF
const replaceSmartCharacters = (jsonData) => {

  let newJSON = jsonData;

  newJSON = newJSON.replaceAll("’", "'");

  // newJSON = newJSON.replaceAll("–", "--");
  newJSON = newJSON.replaceAll("–", "-");

  newJSON = newJSON.replaceAll(" ", " ");

  newJSON = newJSON.replaceAll("“", "\"");
  newJSON = newJSON.replaceAll("”", "\"");

  return newJSON;

};


exports.isEmpty = isEmpty;
exports.isNonEmptyArray = isNonEmptyArray;
exports.getDateTime = getDateTime;
exports.tryParseJSON = tryParseJSON;
exports.formatLowerCase = formatLowerCase;
exports.formatUpperCase = formatUpperCase;
exports.formatTrim = formatTrim;
exports.formatToString = formatToString;
exports.formatInt = formatInt;
exports.formatFloat = formatFloat;
exports.formatSearchInput = formatSearchInput;
exports.removeNonAlphanumericCharacters = removeNonAlphanumericCharacters;
exports.replaceSmartCharacters = replaceSmartCharacters;
