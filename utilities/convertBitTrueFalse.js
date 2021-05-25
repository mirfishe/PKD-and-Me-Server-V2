
const componentName = "convertBitTrueFalse.js";


module.exports = convertBitTrueFalse = (records) => {
  // console.log(componentName, "convertBitTrueFalse records", records);
  // console.log(componentName, "convertBitTrueFalse process.env.DATABASE_DIALECT", process.env.DATABASE_DIALECT);

  if (process.env.DATABASE_DIALECT == "mysql") {

    for (let i = 0; i < records.length; i++) {

      if (records[i].active === 1) {
        records[i].active = true;
      } else if (records[i].active === 0) {
        records[i].active = false;
      };

      if (records[i].categoriesActive === 1) {
        records[i].categoriesActive = true;
      } else if (records[i].categoriesActive === 0) {
        records[i].categoriesActive = false;
      };

      if (records[i].editionsActive === 1) {
        records[i].editionsActive = true;
      } else if (records[i].editionsActive === 0) {
        records[i].editionsActive = false;
      };

      if (records[i].mediaActive === 1) {
        records[i].mediaActive = true;
      } else if (records[i].mediaActive === 0) {
        records[i].mediaActive = false;
      };

      if (records[i].titlesActive === 1) {
        records[i].titlesActive = true;
      } else if (records[i].titlesActive === 0) {
        records[i].titlesActive = false;
      };

      if (records[i].userreviewsActive === 1) {
        records[i].userreviewsActive = true;
      } else if (records[i].userreviewsActive === 0) {
        records[i].userreviewsActive = false;
      };

      if (records[i].usersActive === 1) {
        records[i].usersActive = true;
      } else if (records[i].usersActive === 0) {
        records[i].usersActive = false;
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

      if (records[i].admin === 1) {
        records[i].admin = true;
      } else if (records[i].admin === 0) {
        records[i].admin = false;
      };

    };

  };

  return records;

};

