const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const { server, currency, pre } = require("../settings.json");
const { typing } = require("../data/emojis.json")

module.exports = {
  name: "help",
  description: "Sends you a dm of detailed list of Memexplorer's commands.",
  aliases: ["commands"],
  async execute (client, message, args) {
      
    const msg = await message.channel.send(`${typing} Sending a list of my commands...`);

    const user = message.member;    
    const { commands } = message.client;
    const data = [];

		if (!args.length) {
      let helpStr = 
`**List of available commands**

Type \`${pre}<command>\` to use a command. 
To get more info on a specific command do \`${pre}help <command>\`

**bio** - set your bio
**daily** - earn a random number of Bytes every 24 hours.
**donate** - sends a link to donate
**invite** - invite link for the bot
**leaderboard** - displays the users with the most ${currency}
**meme** - displays a meme
**ping** - sends the bot's ping
**play** - play an mp3 file
**popular** - displays the posts with the most likes
**profile** - displays the user's profile
**report** - report a post for not following the guidelines
**stats** - displays the bot's stats
**support** - sends you the support server
**upload** - upload a meme to the database

Need more help? Join the support server: ${server}
Website: https://memexplorer.com
`;

      try{
          await user.send(helpStr);
          msg.edit(`Sent you a dm with my commands <@${message.author.id}>!`)
      } catch (e) {
          return msg.edit(`Your dms are disabled  <@${message.author.id}>, here are my commands:
${helpStr}
          `)
      }
    } else {

      if (!commands.has(args[0])) {
        return message.reply("That's not a valid command!");
      }
      const command = commands.get(args[0]);

      data.push(`**Name:** ${command.name}`);

      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

      message.channel.send(data, { split: true });
    }
  },
};