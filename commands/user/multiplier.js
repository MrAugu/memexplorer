const Discord = require("discord.js");
const { invisible } = require("../../data/colors.json");
const profiles = require("../../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;
const { dblToken } = require("../../tokens.json");
const DBL = require("dblapi.js");
const dbl = new DBL(dblToken, this.client);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});
  

module.exports = {
  name: "multiplier",
  description: "Get up to two times amount of Bytes.",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    dbl.hasVoted(message.author.id).then(voted => {
      profiles.findOne({
        authorID: message.author.id,
      }, async (err, res) => {
        if (voted || res.multiplier) {
          message.channel.send("Your multiplier is already active!");
          res.multiplier = true;
        } else {
          const embed = new Discord.RichEmbed()
            .setDescription("You must vote for the bot to activate the multiplier: https://discordbots.org/bot/530766901282996224/vote")
            .setFooter("If you already voted give it 1 minute to process", message.author.displayAvatarURL)
            .setTimestamp()
            .setColor(invisible);
          return message.channel.send(embed);	
        }
      });
    });
  },
};