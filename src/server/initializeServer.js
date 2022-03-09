const chalk = require("chalk");
const debug = require("debug")("movie-api:server:initializeServer");

const startServer = (port, app) =>
  new Promise((resolve, reject) => {
    debug(chalk.whiteBright("Starting server..."));
    const server = app.listen(port, () => {
      debug(
        chalk.greenBright(
          `Server is up at http://localhost:${port === "80" ? "" : port}`
        )
      );
      resolve();
    });

    server.on("error", (error) => {
      const errorMessage = `Couldn't start the server.${
        error.code === "EADDRINUSE" ? ` Port ${port} in use` : ""
      }`;
      reject(new Error(errorMessage));
    });
  });

module.exports = startServer;
