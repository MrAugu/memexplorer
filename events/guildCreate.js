const Discord = require('discord.js');
const { green, red } = require('../data/colors.json');
const { events } = require('../data/channels.json');
const moment = require('moment');
const db = require('quick.db');

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
      let embed = new Discord.RichEmbed()
      .setAuthor(`${this.client.user.username} | ${this.client.guilds.size} servers`, client.user.avatarURL)
      .setColor(green)
      .setThumbnail(guild.iconURL)
      .setDescription(`${this.client.user.username} has been **added** to a server.`)
      .addField("Guild", `${guild.name}`, true)
      .addField("Guild ID", `${guild.id}`, true)
      .addField("Users", `${guild.memberCount} users`, true)
      .addField("Region", `${guild.region}`, true)
      .addField("Owner", `${guild.owner} (${guild.ownerID})`)
      .setFooter(`Created On - ${moment(guild.createdAt).format('LLLL')}`, guild.iconURL)
      .setTimestamp();
      this.client.channels.get(events).send(embed);

      db.add(`serversJoined.${this.client.user.id}`, 1);
    }
};
