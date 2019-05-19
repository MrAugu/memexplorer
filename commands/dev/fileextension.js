const Discord = require("discord.js");
const { loading, upvote, downvote } = require("../../data/emojis.json"); // eslint-disable-line no-unused-vars

module.exports = {
  name: "fileextension",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    try {
        const msg = await message.channel.send(`${loading} Fetching file extension...`);
        const attachment = message.attachments.first();
        let filename = attachment.filename;
        const att = filename.substring(filename.lastIndexOf("."));
        msg.edit(att);;
    } catch (error) {
        console.log(error);
    }
  }
};