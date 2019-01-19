const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  authorID: String,
  wiiPoints: Number,
  bio: String,
  totalPosts: Number
});

module.exports = mongoose.model("profiles", profileSchema);