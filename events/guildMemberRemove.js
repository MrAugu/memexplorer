const { members } = require('../data/channels.json');
const Discord = require('discord.js');

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (member) {
    const embed = new Discord.RichEmbed()
    .setAuthor(`${member.user.tag} (${member.user.id}) left the server`, member.user.displayAvatarURL)
    .setFooter(`Created: ${member.user.createdAt}`)
    .setColor("#e74c3c");
    this.client.channels.get(members).send(embed);
  }
};
