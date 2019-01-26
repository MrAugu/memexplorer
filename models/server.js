const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: Number,
  prefix: String,
});

module.exports = mongoose.model("servers", serverSchema);