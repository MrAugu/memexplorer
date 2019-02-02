const Discord = require('discord.js');
const { green } = require('../data/colors.json');
const { events } = require('../data/channels.json');
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

      if(this.client.settings.testing) return;
      db.add(`serversJoined.${this.client.user.id}`, 1);
      dbl.postStats(this.client.guilds.size);
    }
};
