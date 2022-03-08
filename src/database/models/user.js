const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  movies: [
    {
      imdbID: { type: String },
      rating: { type: Number },
      watchlist: { type: Boolean, default: false },
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
