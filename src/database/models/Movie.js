const mongoose = require("mongoose");

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  runtime: { type: Number, required: true },
  genre: { type: String },
  type: { type: String, required: true },
  director: { type: String, required: true },
  writer: { type: String, required: true },
  actors: { type: String, required: true },
  plot: { type: String, required: true },
  image: { type: String },
  metascore: { type: Number },
  imdbRating: { type: Number },
  imdbID: { type: String },
  watchlist: { type: Boolean, default: false },
  rating: { type: Number },
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

module.exports = Movie;
