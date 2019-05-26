module.exports = {
  name: "invite",
  description: "Invite link for the bot",
  async execute (client, message, args) { 
    return message.channel.send("Invite me using this link: https://memexplorer.com/invite");
  },  
};