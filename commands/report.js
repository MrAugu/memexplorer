const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const ms = require("parse-ms");
const { typing } = require("../data/emojis.json");
const { reports } = require("../data/channels.json");
const { red } = require("../data/colors.json");
const { pre } = require("../settings.json");
const posts = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "report",
  description: "Report a meme for not following the guidelines.",
  usage: "<meme id> <reason>",
  args: true,
  async execute (client, message, args) {
    const msg = await message.channel.send(`${typing} Sending report...`);

    if(isNaN(args[0])) return msg.edit(`Please provide a number of the meme id.`);
    if(!args[1]) return msg.edit(`Please include a reason for your report. Usage: \`${prefix}report <meme id> <reason>\``);
    
    let i = args[0];

    posts.findOne({
      id: i,
      state: "POST_APPROVED"
    }, async (err, meme) => {
      if (err) console.log(err);

      if (!meme) return msg.edit(replies.noMeme);
      
      const t = ms(Date.now() - meme.uploadedAt);
      const time = convertTime(t);
      let title = meme.title;
      if(title === undefined) title = `Untitled`
      const votes = meme.upVotes - meme.downVotes;
      const user = await client.fetchUser(meme.authorID);

      let v;
      if(votes == 1) v = "Vote"
      else v = "Votes";

      const embed = new Discord.RichEmbed()
        .setAuthor(`Reported By ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
        .setTitle(`${title} - ${meme.upVotes} Likes / ${meme.downVotes} Dislikes`)
        .setDescription(`Reason: ${args[1]}`)
        .setImage(meme.url)
        .setColor(red)
        .setFooter(`<#${meme.id}>  Meme posted by ${user.tag} ${time} ago`, user.displayAvatarURL)
        .setTimestamp();
      client.channels.get(reports).send(embed);
      msg.edit(`Successfully reported Meme \`<#${meme.id}>\`. (If the meme is not following our guidelines it will be deleted from the database, and the user might receive a punishment.)`)
      
      meme.reports++;
    });
  },
};

function convertTime (time) {
  let timeInt;
  let timeString;
  if (time.days == 0) {
    if (time.hours == 0) {
      if (time.minutes == 0) {
        timeInt = time.seconds;
        timeString = " second(s)";
      } else {
        timeInt = time.minutes;
        timeString = " minute(s)";
      }
    } else {
      timeInt = time.hours;
      timeString = " hour(s)";
    }
  } else {
    timeInt = time.days;
    timeString = " day(s)";
  }

  const timeVar = timeInt + timeString;
  return timeVar;
}