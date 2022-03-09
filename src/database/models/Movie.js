const mongoose = require("mongoose");

const { Schema } = mongoose;

const movieSchema = new Schema({
  Title: { type: String, required: true },
  Year: { type: Number, required: true },
  Runtime: { type: Number, required: true },
  Genre: { type: String },
  Type: { type: String, required: true },
  Director: { type: String, required: true },
  Writer: { type: String, required: true },
  Actors: { type: String, required: true },
  Plot: { type: String, required: true },
  Poster: { type: String },
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

module.exports = Movie;
