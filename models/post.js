const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  id: Number,
  authorID: String,
  uploadedAt: String,
  url: String,
  upVotes: Number,
  downVotes: Number,
  aprovedBy: String,
  state: String,
  votes: Array
});

module.exports = mongoose.model("posts", postSchema);