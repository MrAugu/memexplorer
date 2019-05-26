const Discord = require("discord.js"); 
const { loading } = require("../../data/emojis.json");
const replies = require("../../data/replies.json");
const { invisible } = require("../../data/colors.json");
const servers = require("../../models/server.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "listen",
  description: "The bot will resume responding to commands from the channel.",
  usage: "<channel>",
  args: true,
  async execute (client, message, args) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(replies.noPerms);

    const msg = await message.channel.send(`${loading} Listening to commands from channel...`);
    
    let channel;
    if(message.mentions.channels.first() === undefined){
        if(!isNaN(args[0])) channel = args[0];
        else message.channel.send("No channel detected.");
    } else {
        channel = message.mentions.channels.first().id;
    }

    channels.findOne({
        channelID: channel
    }, async (err, c) => {
        if (err) console.log(err);
        c.ignore = false;
        await c.save().catch(e => console.log(e));
        msg.edit(`I will now listen to commands from ${args[0]}`)
    });
  },
};