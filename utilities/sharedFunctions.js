"use strict";

// const componentName = "sharedFunctions.js";

const convertBitTrueFalse = (records) => {
  // console.log(componentName, "convertBitTrueFalse records", records);
  // console.log(componentName, "convertBitTrueFalse process.env.DATABASE_DIALECT", process.env.DATABASE_DIALECT);

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF -- 08/13/2021 MF
  // ? Need to limit this function to only MySQL? -- 08/13/2021 MF
  // if (process.env.DATABASE_DIALECT == "mysql") {

  for (let i = 0; i < records.length; i++) {

    if (records[i].active === 1) {

      records[i].active = true;

    } else if (records[i].active === 0) {

      records[i].active = false;

    };

    if (records[i].categoryActive === 1) {

      records[i].categoryActive = true;

    } else if (records[i].categoryActive === 0) {

      records[i].categoryActive = false;

    };

    if (records[i].editionActive === 1) {

      records[i].editionActive = true;

    } else if (records[i].editionActive === 0) {

      records[i].editionActive = false;

    };

    if (records[i].mediaActive === 1) {

      records[i].mediaActive = true;

    } else if (records[i].mediaActive === 0) {

      records[i].mediaActive = false;

    };

    if (records[i].titleActive === 1) {

      records[i].titleActive = true;

    } else if (records[i].titleActive === 0) {

      records[i].titleActive = false;

    };

    if (records[i].userreviewActive === 1) {

      records[i].userreviewActive = true;

    } else if (records[i].userreviewActive === 0) {

      records[i].userreviewActive = false;

    };

    if (records[i].userActive === 1) {

      records[i].userActive = true;

    } else if (records[i].userActive === 0) {

      records[i].userActive = false;

    };

    if (records[i].electronic === 1) {

      records[i].electronic = true;

    } else if (records[i].electronic === 0) {

      records[i].electronic = false;

    };

    if (records[i].read === 1) {

      records[i].read = true;

    } else if (records[i].read === 0) {

      records[i].read = false;

    };

    if (records[i].owned === 1) {

      records[i].owned = true;

    } else if (records[i].owned === 0) {

      records[i].owned = false;

    };

    if (records[i].admin === 1) {

      records[i].admin = true;

    } else if (records[i].admin === 0) {

      records[i].admin = false;

    };

    if (records[i].display === 1) {

      records[i].display = true;

    } else if (records[i].display === 0) {

      records[i].display = false;

    };

    if (records[i].alwaysFilter === 1) {

      records[i].alwaysFilter = true;

    } else if (records[i].alwaysFilter === 0) {

      records[i].alwaysFilter = false;

    };

    if (records[i].posted === 1) {

      records[i].posted = true;

    } else if (records[i].posted === 0) {

      records[i].posted = false;

    };

  };

  // };

  return records;

};


const IsEmpty = (value) => {
  // console.log(componentName, GetDateTime(), "IsEmpty value", value);

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


exports.convertBitTrueFalse = convertBitTrueFalse;
exports.IsEmpty = IsEmpty;
exports.GetDateTime = GetDateTime;
exports.TryParseJSON = TryParseJSON;
