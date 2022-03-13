const express = require("express");
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require("../controllers/moviesController");

const router = express.Router();

router.get("/", getMovies);

router.delete("/:movieId", deleteMovie);

router.post("/", createMovie);

module.exports = router;
