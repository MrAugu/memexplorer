const Discord = require('discord.js');
const { red } = require('../data/colors.json');
const { events } = require('../data/channels.json');
const { testing } = require('../settings.json');
const moment = require('moment');
const { dblToken } = require("../tokens.json");
const DBL = require("dblapi.js");
const dbl = new DBL(dblToken, this.client);
const db = require('quick.db');

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
      let embed = new Discord.RichEmbed()
      .setAuthor(`${this.client.user.username} | ${this.client.guilds.size} servers`, this.client.user.avatarURL)
      .setColor(red)
      .setThumbnail(guild.iconURL)
      .setDescription(`${this.client.user.username} has been **removed** from a server.`)
      .addField("Guild", `${guild.name}`, true)
      .addField("Guild ID", `${guild.id}`, true)
      .addField("Users", `${guild.memberCount} users`, true)
      .addField("Region", `${guild.region}`, true)
      .addField("Owner", `${guild.owner} (${guild.ownerID})`)
      .setFooter(`Created On - ${moment(guild.createdAt).format('LLLL')}`, guild.iconURL)
      .setTimestamp();
      this.client.channels.get(events).send(embed);

      if(testing) return;
      db.add(`serversLeft.${this.client.user.id}`, 1);
      dbl.postStats(this.client.guilds.size);
    }
};
