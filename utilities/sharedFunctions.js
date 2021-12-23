"use strict";

// const componentName = "sharedFunctions.js";

const IsEmpty = (value) => {
  // console.log(componentName, GetDateTime(), "IsEmpty value", value);

  // * https://stackoverflow.com/questions/4597900/checking-something-isempty-in-javascript -- 03/06/2021 MF
  // * https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in -- 03/06/2021 MF

  // const IsEmpty = (object) => {

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
  // console.log(componentName, GetDateTime(), "IsEmpty(\"\")", IsEmpty(""));
  // console.log(componentName, GetDateTime(), "IsEmpty(null)", IsEmpty(null));
  // console.log(componentName, GetDateTime(), "IsEmpty(undefined)", IsEmpty(undefined));
  // console.log(componentName, GetDateTime(), "IsEmpty([])", IsEmpty([]));
  // console.log(componentName, GetDateTime(), "IsEmpty({})", IsEmpty({}));

  // * Returns false -- 03/06/2021 MF
  // console.log(componentName, GetDateTime(), "IsEmpty(\"test\")", IsEmpty("test"));
  // console.log(componentName, GetDateTime(), "IsEmpty(5)", IsEmpty(5));
  // console.log(componentName, GetDateTime(), "IsEmpty(true)", IsEmpty(true));
  // console.log(componentName, GetDateTime(), "IsEmpty([\"test\"])", IsEmpty(["test"]));
  // console.log(componentName, GetDateTime(), "IsEmpty({test: \"test\"})", IsEmpty({ test: "test" }));

};


const GetDateTime = () => {
  // console.log("GetDateTime");
  // console.log("GetDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \" \")", new Date().toISOString().slice(0, 19).replace("T", " "));
  // console.log("GetDateTime new Date().toISOString().slice(0, 19).replace(\"T\", \"\")", new Date().toISOString().slice(0, 19).replace("T", ""));
  // console.log("GetDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \" \")", new Date().toLocaleString().slice(0, 19).replace("T", " "));
  // console.log("GetDateTime new Date().toLocaleString().slice(0, 19).replace(\"T\", \"\")", new Date().toLocaleString().slice(0, 19).replace("T", ""));

  // * Time returned does not consider the time zone without adjustments. -- 08/09/2021 MF
  // * https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes -- 08/09/2021 MF

  // * https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local -- 08/09/2021 MF
  let timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  // return new Date().toLocaleString();
  // return new Date().toLocaleString().slice(0, 19).replace("T", " ");
  // return new Date().toISOString().slice(0, 19).replace("T", " ");
  return new Date(new Date() - timezoneOffset).toISOString().slice(0, 19).replace("T", " ");

};


const TryParseJSON = (jsonString) => {
  // console.log(componentName, GetDateTime(), "tryParseJSON jsonString", jsonString);

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
    // console.log(componentName, GetDateTime(), "tryParseJSON error", error);
  };

  return false;

};


const FormatLowerCase = (value) => {
  // console.log(componentName, GetDateTime(), "FormatLowerCase value", value);

  let lowerCaseValue = value;

  if (IsEmpty(value) === false) {

    lowerCaseValue = value.toString().toLowerCase();

  };

  return lowerCaseValue;

};


const FormatUpperCase = (value) => {
  // console.log(componentName, GetDateTime(), "FormatUpperCase value", value);

  let upperCaseValue = value;

  if (IsEmpty(value) === false) {

    upperCaseValue = value.toString().toUpperCase();

  };

  return upperCaseValue;

};


const FormatTrim = (value) => {
  // console.log(componentName, GetDateTime(), "FormatTrim value", value);

  let trimValue = value;

  if (IsEmpty(value) === false) {

    trimValue = value.toString().trim();

  };

  return trimValue;

};


const FormatToString = (value) => {
  // console.log(componentName, GetDateTime(), "FormatToString value", value);

  let toStringValue = value;

  if (IsEmpty(value) === false) {

    toStringValue = value.toString();

  };

  return toStringValue;

};


const FormatSearchInput = (value) => {
  // console.log(componentName, GetDateTime(), "FormatSearchInput value", value);

  let formatedSearchInput = value;

  if (IsEmpty(value) === false) {

    formatedSearchInput = FormatTrim(value).toLowerCase();

  };

  return formatedSearchInput;

};


exports.IsEmpty = IsEmpty;
exports.GetDateTime = GetDateTime;
exports.TryParseJSON = TryParseJSON;
exports.FormatLowerCase = FormatLowerCase;
exports.FormatUpperCase = FormatUpperCase;
exports.FormatTrim = FormatTrim;
exports.FormatToString = FormatToString;
exports.FormatSearchInput = FormatSearchInput;
