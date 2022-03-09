const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  movies: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Movie" },
      rating: { type: Number },
      watchlist: { type: Boolean, default: false },
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
