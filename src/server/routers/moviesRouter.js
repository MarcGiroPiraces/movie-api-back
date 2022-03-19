const express = require("express");
const multer = require("multer");
const createMovieJoiValidation = require("../middlewares/createMovieJoiValidation");
const {
  getMovies,
  deleteMovie,
  createMovie,
  updateMovie,
} = require("../controllers/moviesController");
const auth = require("../middlewares/auth");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", getMovies);

router.delete("/:movieId", auth, deleteMovie);

router.post(
  "/",
  auth,
  upload.single("Poster"),
  createMovieJoiValidation,
  createMovie
);

router.put(
  "/:movieId",
  auth,
  upload.single("Poster"),
  createMovieJoiValidation,
  updateMovie
);

module.exports = router;
