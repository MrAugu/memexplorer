const mongoose = require("mongoose");

const channelSchema = mongoose.Schema({
  channelID: Number,
  ignore: Boolean,
});

module.exports = mongoose.model("channels", channelSchema);