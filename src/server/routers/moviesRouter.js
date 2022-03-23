const express = require("express");
const multer = require("multer");
const { validate } = require("express-validation");
const {
  getMovies,
  deleteMovie,
  createMovie,
  updateMovie,
  getMovie,
} = require("../controllers/moviesController");
const auth = require("../middlewares/auth");
const schemaMovieJoi = require("../schemas/schemaMovieJoi");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", getMovies);

router.get("/:movieId", getMovie);

router.delete("/:movieId", auth, deleteMovie);

router.post(
  "/",
  auth,
  upload.single("Poster"),
  validate(schemaMovieJoi),
  createMovie
);

router.put("/:movieId", auth, upload.single("Poster"), updateMovie);

module.exports = router;
