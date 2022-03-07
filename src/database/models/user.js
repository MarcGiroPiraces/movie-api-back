const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movies" }],
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
