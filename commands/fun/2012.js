const Discord = require("discord.js");
const superagent = require("superagent");
const { invisible } = require("../../data/colors.json");

module.exports = {
  name: "2012",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    const { body } = await superagent.get("https://api-to.get-a.life/meme");

    const embed = new Discord.RichEmbed()
      .setDescription("🤣 Funny 2012 Meme", body.url)
      .setImage(body.url)
      .setColor(invisible);
    message.channel.send(embed);
  },  
};