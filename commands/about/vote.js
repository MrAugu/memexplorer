module.exports = {
  name: "vote",
  description: "Link to vote for the bot",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    return message.channel.send("Vote for me here: https://discordbots.org/bot/530766901282996224/vote");
  },  
};