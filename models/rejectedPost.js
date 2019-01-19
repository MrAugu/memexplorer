const mongoose = require("mongoose");

const rejectPostSchema = mongoose.Schema({
  id: String,
  authorID: String,
  uploadedAt: String,
  url: String,
  rejectedBy: String,
  reason: String
});

module.exports = mongoose.model("rejectedPost", rejectPostSchema);