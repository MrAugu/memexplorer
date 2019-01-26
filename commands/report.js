const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading, whitelist } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const replies = require("../data/replies.json");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "report",
  description: "Report a meme for not following the guidelines.",
  usage: "<meme id>",
  args: true,
  async execute (client, message, args) {

  },
};