const Movie = require("../../database/models/Movie");

const getMovies = (req, res, next) => {
  const movies = Movie.find();
  if (!movies) {
    const error = new Error("No movies found");
    error.code = 404;
    error.message = "No movies found";
    next(error);
    return;
  }
  res.json({ movies });
};

module.exports = { getMovies };
