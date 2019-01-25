const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  authorID: String,
  wiiPoints: Number,
  bio: String,
  totalPosts: Number,
  blacklisted: Boolean,
  voted: Boolean,
  supporter: Boolean,
  supporterr: Boolean,
  supporterrr: Boolean,
  mod: Boolean,
  developer: Boolean,
});

module.exports = mongoose.model("profiles", profileSchema);