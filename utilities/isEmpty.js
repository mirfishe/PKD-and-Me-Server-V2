
const getDateTime = require("../utilities/getDateTime");

const componentName = "isEmpty.js";


module.exports = isEmpty = (value) => {
  // console.log(componentName, getDateTime(), "IsEmpty value", value);

  // * https://stackoverflow.com/questions/4597900/checking-something-isempty-in-javascript
  // * https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in

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

  // * Returns true
  // console.log(componentName, getDateTime(), "IsEmpty(\"\")", IsEmpty(""));
  // console.log(componentName, getDateTime(), "IsEmpty(null)", IsEmpty(null));
  // console.log(componentName, getDateTime(), "IsEmpty(undefined)", IsEmpty(undefined));
  // console.log(componentName, getDateTime(), "IsEmpty([])", IsEmpty([]));
  // console.log(componentName, getDateTime(), "IsEmpty({})", IsEmpty({}));

  // * Returns false
  // console.log(componentName, getDateTime(), "IsEmpty(\"test\")", IsEmpty("test"));
  // console.log(componentName, getDateTime(), "IsEmpty(5)", IsEmpty(5));
  // console.log(componentName, getDateTime(), "IsEmpty(true)", IsEmpty(true));
  // console.log(componentName, getDateTime(), "IsEmpty([\"test\"])", IsEmpty(["test"]));
  // console.log(componentName, getDateTime(), "IsEmpty({test: \"test\"})", IsEmpty({ test: "test" }));

};
