
const componentName = "sharedFunctions.js";


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

