const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  id: Number,
  iChannels: Array,
});

module.exports = mongoose.model("servers", postSchema);