const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: Number,
  prefix: String,
  feed: String,
  ignore: Array,
});

module.exports = mongoose.model("servers", serverSchema);