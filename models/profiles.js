const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  authorID: String,
  wiiPoints: Number,
  bio: String,
  totalPosts: Number,
<<<<<<< HEAD
  blacklisted: Boolean,
=======
  items: Array,
  badges: Array
>>>>>>> a3f89a5a8ba421bfc54be3916fd55e08b3b7a6d3
});

module.exports = mongoose.model("profiles", profileSchema);