
// let databaseURL = "";
// let dialectValue = "";

// if (process.env.DATABASE_DIALECT == "postgres") {
//   databaseURL = process.env.DATABASE_URL_POSTGRESQL;
//   dialectValue = "postgres";
// } else if (process.env.DATABASE_DIALECT == "mysql") {
//   databaseURL = process.env.DATABASE_URL_MYSQL;
//   dialectValue = "mysql";
// } else if (process.env.DATABASE_DIALECT == "mssql") {
//   databaseURL = process.env.DATABASE_URL_SQLSERVER;
//   dialectValue = "mssql";
// } else {
//   // * Set to postgres by default
//   databaseURL = process.env.DATABASE_URL_POSTGRESQL;
//   dialectValue = "postgres";
// };


module.exports = {

  // config: {
  //   client: "mssql",
  //   connection: {
  //     host: "localhost",
  //     // host: "127.0.0.1",
  //     user: process.env.DATABASE_USER,
  //     password: process.env.DATABASE_PASSWORD,
  //     database: process.env.DATABASE_NAME,
  //     // options: { encrypt: false } // ! Needs to be set to default for the localhost? https://stackoverflow.com/questions/66504525/error-no-event-socketconnect-in-state-sentprelogin
  //   }
  // }

  // ! pm2 doesn't see the .env variables being used here and then isn't able to access MySql.
  config: {
    client: "mysql2",
    connection: {
      host: "localhost",
      // host: "127.0.0.1",
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // options: { encrypt: false } // ! Needs to be set to default for the localhost? https://stackoverflow.com/questions/66504525/error-no-event-socketconnect-in-state-sentprelogin
    }
  }

};