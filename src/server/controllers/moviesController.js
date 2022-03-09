/* eslint-disable no-underscore-dangle */
const Movie = require("../../database/models/Movie");

const getMovies = async (req, res, next) => {
  const search = req.query.s;
  const movies = await Movie.find({ title: { $eq: search } });
  if (movies.length < 1) {
    const error = new Error("No movies found");
    error.code = 404;
    error.message = "No movies found";
    next(error);
    return;
  }

  const moviesData = movies.map((movie) => ({
    title: movie.title,
    year: movie.year,
    type: movie.type,
    image: movie.image,
    id: movie.id,
  }));
  res.json(moviesData);
};

module.exports = { getMovies };
