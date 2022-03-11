const express = require("express");
const { getMovies, deleteMovie } = require("../controllers/moviesController");

const router = express.Router();

router.get("/", getMovies);

router.delete("/:movieId", deleteMovie);

module.exports = router;
