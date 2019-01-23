const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  id: Number,
  authorID: String,
  uploadedAt: String,
  url: String,
  upVotes: Number,
  downVotes: Number,
  approvedBy: String,
  state: String,
  votes: Array,
  rejectedBy: String,
  removedBy: String
});

module.exports = mongoose.model("posts", postSchema);
