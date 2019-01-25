const mongoose = require("mongoose");

const channelSchema = mongoose.Schema({
  channelID: Number,
  ignored: Boolean
});

module.exports = mongoose.model("channel", channelSchema);