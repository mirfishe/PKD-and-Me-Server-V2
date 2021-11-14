"use strict";

// const GetDateTime = require("../utilities/getDateTime");

// const componentName = "isEmpty.js";


const isEmpty = (value) => {
  // console.log(componentName, GetDateTime(), "isEmpty value", value);

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
  // console.log(componentName, GetDateTime(), "isEmpty(\"\")", isEmpty(""));
  // console.log(componentName, GetDateTime(), "isEmpty(null)", isEmpty(null));
  // console.log(componentName, GetDateTime(), "isEmpty(undefined)", isEmpty(undefined));
  // console.log(componentName, GetDateTime(), "isEmpty([])", isEmpty([]));
  // console.log(componentName, GetDateTime(), "isEmpty({})", isEmpty({}));

  // * Returns false -- 03/06/2021 MF
  // console.log(componentName, GetDateTime(), "isEmpty(\"test\")", isEmpty("test"));
  // console.log(componentName, GetDateTime(), "isEmpty(5)", isEmpty(5));
  // console.log(componentName, GetDateTime(), "isEmpty(true)", isEmpty(true));
  // console.log(componentName, GetDateTime(), "isEmpty([\"test\"])", isEmpty(["test"]));
  // console.log(componentName, GetDateTime(), "isEmpty({test: \"test\"})", isEmpty({ test: "test" }));

};


module.exports = isEmpty;