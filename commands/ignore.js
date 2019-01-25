const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const replies = require("../data/replies.json");
const profiles = require("../models/profiles.js");
const servers = require("../models/server.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "ignore",
  description: "The bot will stop responding to commands from the channel.",
  usage: "<channel>",
  args: true,
  async execute (client, message, args) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(replies.noPerms);

    const msg = await message.channel.send(`${loading} Ignoring commands from channel...`);
    
    let channel;
    if(message.mentions.channels.first() === undefined){
        if(!isNaN(args[0])) channel = args[0];
        else message.channel.send("No channel detected.");
    } else {
        channel = message.mentions.channels.first().id;
    }

    servers.findOne({
        serverID: message.guild.id
    }, async (err, s) => {
        if (err) console.log(err);
        s.ignoredChannels.push(channel.id);
        msg.edit(`I will now ignore commands from ${args[0]}`)
        await s.save().catch(e => console.log(e));
    });
  },
};