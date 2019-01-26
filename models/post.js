const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  id: Number,
  title: String,
  authorID: String,
  uploadedAt: String,
  url: String,
  upVotes: Number,
  downVotes: Number,
  approvedBy: String,
  state: String,
  votes: Array,
  rejectedBy: String,
  deletedBy: String,
  reports: Number,
  type: String,
  videoUrl: String,
});

module.exports = mongoose.model("posts", postSchema);
