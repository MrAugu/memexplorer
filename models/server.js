const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  id: Number,
  bUsers: Array,
  iChannels: Array,
});

module.exports = mongoose.model("servers", postSchema);