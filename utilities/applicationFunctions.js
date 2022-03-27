"use strict";

// const componentName = "applicationFunctions";

const convertBitTrueFalse = (records) => {
  // console.log(componentName, "convertBitTrueFalse records", records);
  // console.log(componentName, "convertBitTrueFalse process.env.DATABASE_DIALECT", process.env.DATABASE_DIALECT);

  // ! pm2 doesn't see the .env variables being used here. -- 08/13/2021 MF -- 08/13/2021 MF
  // ? Need to limit this function to only MySQL? -- 08/13/2021 MF
  // if (process.env.DATABASE_DIALECT == "mysql") {

  if (Array.isArray(records) === true) {

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

  };

  // };

  return records;

};


exports.convertBitTrueFalse = convertBitTrueFalse;
