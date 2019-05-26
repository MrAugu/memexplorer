/* const mongoose = require("mongoose");
const validUrl = require("valid-url");
const mongoUrl = require("../../tokens.json").mongodb;
const { loading } = require("../../data/emojis.json");
const Discord = require("discord.js"); 

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "play",
  description: "Play an mp3 file in a voice channel.",
  cooldown: "5",
  async execute (client, message, args) { 
    if (!message.member.voiceChannel) return message.channel.send("You must join a voice channel to use this command.");

    const msg = await message.channel.send(`${loading} Joining vc...`);
    try {
      let mp3;
      if (!message.attachments.first()) {
        if (args[0] && validUrl.isUri(args[0])) {
          mp3 = args[0];
        }
      } else {
        mp3 = message.attachments.first().url;
      }
      const connection = await message.member.voiceChannel.join();
      const voiceChannel = message.member.voiceChannel;
      const dispatcher = connection.playStream(mp3);
      msg.edit("Now Playing MP3");
      dispatcher.on("end", () => {
        voiceChannel.leave();
        msg.edit("MP3 Ended");
      });
    } catch (e) {
      console.log(e);
      return msg.edit("An error occured. Please make sure you are playing an MP3 file!");
    }
  },
};
