const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: Number,
  ignoredChannels: Array,
});

module.exports = mongoose.model("servers", serverSchema);