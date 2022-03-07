require("dotenv").config();
const app = require("./server");
const initializeServer = require("./server/initializeServer");
const connectToDB = require("./database");

const port = process.env.PORT || 400;
const connectionString = process.env.MONGO_DB_STRING;

(async () => {
  await connectToDB(connectionString);
  await initializeServer(port, app);
})();
