const { members } = require('../data/channels.json');
const Discord = require('discord.js');

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (member) {
    if(member.guild.id === "533778546288754689"){
      const embed = new Discord.RichEmbed()
      .setAuthor(`${member.user.tag} (${member.user.id}) joined the server`, member.user.displayAvatarURL)
      .setFooter(`Created: ${member.user.createdAt}`)
      .setColor("#2ecc71");
      this.client.channels.get(members).send(embed);
    }
  }
};
