const Discord = require("discord.js");
const db = require("quick.db");
const { invisible } = require("../data/colors.json");
const { loading, typing } = require("../data/emojis.json"); // eslint-disable-line no-unused-vars
const { version } = require("../settings.json");

module.exports = {
  name: "stats",
  description: "Wii's stats",
  cooldown: "5",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`${loading} Gathering stats...`);
    const botMessages = await db.fetch(`botMessages_${client.user.id}`);

    const totalSeconds = process.uptime();
    const realTotalSecs = Math.floor(totalSeconds % 60);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);

    const embed = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor(invisible)
      .setThumbnail(client.user.avatarURL)
      .addField("Born On", client.user.createdAt)
      .addField("Current Version", version, true)
      .addField("Messages Sent", `${botMessages} messages`, true)
      .addField("Servers", `${client.guilds.size} servers`, true)
      .addField("Users", `${client.users.size.toLocaleString()} users`, true)
      .addField("Ping", `Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\` | API Latency \`${Math.round(client.ping)}ms\``)
      .addField("Uptime", `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
      .setFooter("Dev: Tetra#0001 & MrAugu#9016")
      .setTimestamp();
    await msg.edit(embed);
  },
};