const mongoose = require("mongoose");
const chalk = require("chalk");
const debug = require("debug")("movie-api:database");

const connectToDB = (connectionString) =>
  new Promise((resolve, reject) => {
    debug(chalk.whiteBright("Connecting to database..."));
    mongoose.connect(connectionString, (error) => {
      if (error) {
        const newError = {
          ...error,
          message: `Database error: ${error.message}`,
        };
        reject(newError);
        return;
      }

      debug(
        chalk.whiteBright("Connection to database ") +
          chalk.greenBright("SUCCESSFUL")
      );
      resolve();
    });
  });

mongoose.set("toJSON", {
  virtuals: true,
});

module.exports = connectToDB;
