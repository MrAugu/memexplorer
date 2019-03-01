const Discord = require("discord.js");
const { loading } = require("../../data/emojis.json");
const { invisible } = require("../../data/colors.json");

module.exports = {
  name: "ping",
  description: "Bot's latency",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`${loading} Pinging...`);
    const embed = new Discord.RichEmbed()
      .setAuthor("Pong!", client.user.avatarURL)
      .setDescription(`Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency \`${Math.round(client.ping)}ms\``)
      .setColor(invisible)
      .setTimestamp();
    msg.edit(embed);
  },
};