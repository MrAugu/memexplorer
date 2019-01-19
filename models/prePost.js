const mongoose = require("mongoose");

const prePostSchema = mongoose.Schema({
  id: Number,
  authorID: String,
  uploadedAt: String,
  url: String
});

module.exports = mongoose.model("prePosts", prePostSchema);