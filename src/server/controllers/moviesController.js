/* eslint-disable no-underscore-dangle */
const Movie = require("../../database/models/Movie");

const getMovies = async (req, res, next) => {
  const search = req.query.s;
  const movies = await Movie.find({ Title: { $eq: search } }).select(
    "Title Type Poster Year"
  );
  if (movies.length < 1) {
    const error = new Error("No movies found");
    error.code = 404;
    error.message = "No movies found";
    next(error);
    return;
  }

  res.json(movies);
};

module.exports = { getMovies };
