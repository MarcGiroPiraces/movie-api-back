/* eslint-disable no-underscore-dangle */
const Movie = require("../../database/models/Movie");

const getMovies = async (req, res, next) => {
  const search = req.query.s;
  const movies = await Movie.find({
    Title: { $regex: search, $options: "m" },
  }).select("Title Type Poster Year");
  if (movies.length < 1) {
    const error = new Error("No movies found");
    error.code = 404;
    error.message = "No movies found";
    next(error);
    return;
  }
  res.json(movies);
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    await Movie.findByIdAndDelete(movieId);
    res.json({ message: "Movie deleted" });
  } catch (error) {
    error.code = 404;
    error.message = "We couldn't find the movie you requested to delete";
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  const {
    Title,
    Year,
    Runtime,
    Genre,
    Type,
    Director,
    Writer,
    Actors,
    Plot,
    Poster,
  } = req.body;
  try {
    await Movie.create({
      Title,
      Year,
      Runtime,
      Genre,
      Type,
      Director,
      Writer,
      Actors,
      Plot,
      Poster,
    });
    return res
      .status(201)
      .json({ movie: { Title, Year, Type, Poster }, message: "Movie created" });
  } catch (error) {
    error.message = "We couldn't create the movie";
    error.code = 400;
    return next(error);
  }
};

module.exports = { getMovies, deleteMovie, createMovie };
