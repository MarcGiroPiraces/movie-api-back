const express = require("express");
const multer = require("multer");
const createMovieJoiValidation = require("../middlewares/createMovieJoiValidation");
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require("../controllers/moviesController");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", getMovies);

router.delete("/:movieId", deleteMovie);

router.post(
  "/",
  upload.single("Poster"),
  createMovieJoiValidation,
  createMovie
);

module.exports = router;
