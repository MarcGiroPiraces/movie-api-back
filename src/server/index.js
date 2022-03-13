const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const { notFoundError, generalError } = require("../middlewares/errors");
const movieRouter = require("./routers/moviesRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/movies", movieRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
