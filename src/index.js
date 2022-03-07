require("dotenv").config();
const app = require("./server");
const initializeServer = require("./server/initializeServer");

const port = process.env.PORT || 400;

(async () => {
  await initializeServer(port, app);
})();
