const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const { server, currency } = require("../settings.json");

module.exports = {
  name: "help",
  description: "Sends you a dm of detailed list of Wii's commands.",
  aliases: ["commands"],
  async execute (bot, message, args) {
      
    // const user = message.guild.members.get(args[0]) || message.member;      

    const { commands } = message.client;
    const data = [];

    if (!args[0]) {
      return message.channel.send(`
**List of available commands**

Type \`${client.user.username} <command>\` to use a command. 
To get more info on a specific command do \`${client.user.username} help <command>\`

**bio** - set your bio
**invite** - invite link for the bot
**leaderboard** - displays the users with the most ${currency}
**meme** - displays a meme
**ping** - sends the bot's ping
**popular** - displays the posts with the most upvotes
**profile** - displays the user's profile
**stats** - displays the bot's stats
**upload** - upload a meme to the database

Need more help? Join the support server: ${server}
            `);
    } else {
      if (!commands.has(args[0])) {
        return message.reply("That's not a valid command!");
      }

      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.usage) data.push(`**Usage:** \`wii ${command.name} ${command.usage}\``);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      message.channel.send(data, { split: true });
    }
  },
};