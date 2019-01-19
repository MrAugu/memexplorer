const { prefix, mods } = require("../settings.json");
const fs = require("fs");
const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const db = require("quick.db");

module.exports = class {
  constructor (client) {
    this.client = client;
  }
  
  async run (message) {
    if (message.author.bot) return;
    if (message.channel.type === "text") {
      if (!message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
    }

    if(message.content.startsWith("egg")) return message.channel.send("The prefix has been changed to \`wii\`.")

    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);  
    if (message.content.toLowerCase().indexOf(prefix) !== 0 || message.content.match(mentionPrefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.find(c => c.aliases && c.aliases.includes(command));
    if (!cmd) {
      if (fs.existsSync(`./commands/${command}.js`)) {
        try {
          const commandFile = require(`./commands/${command}.js`);
          if (commandFile) commandFile.run(this.client, message, args);
        } catch (error) {
          console.error(error);
          message.reply("There was an error trying to execute that command!");
        }
      }
      return;
    }

    db.add(`botMessages.${this.client.user.id}`, 1);
    db.add(`${cmd.name}.${this.client.user.id}`, 1);
  
    // const blacklisted = await db.fetch(`blacklisted${message.guild.id}`);
    // if (blacklisted === message.author.id) return reply("Seems like you're blacklisted for this guild.");
  
    // const ignored = await db.fetch(`ignored${message.guild.id}`);
    // if (ignored === message.channel.id) return;
  
    if (cmd && !message.guild && cmd.guildOnly) return message.channel.send("I can't execute that command inside DMs!. Please run this command in a server.");
    if (cmd && !args.length && cmd.args === true) return message.channel.send(`You didn't provide any arguments ${message.author}.\nCorrect Usage: \`${prefix}${cmd.name} ${cmd.usage}\``);

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
  
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = cmd.cooldown * 100;

    if (!mods.includes(message.author.id)) {
      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
      else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`);
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }
  
    try {
      cmd.execute(this.client, message, args);
    } catch (e) {
      console.error(e);
      message.reply("There was an error trying to execute that command!");
    }
  }
};
  