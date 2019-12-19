const Discord = require("discord.js"); 
const ms = require("parse-ms");
const { typing } = require("../../data/emojis.json");
const { reports, logs } = require("../../data/channels.json");
const { red } = require("../../data/colors.json");
const posts = require("../..//models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;

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

    if (isNaN(args[0])) return msg.edit("Please provide a number of the meme id.");
    if (!args[1]) return msg.edit(`Please include a reason for your report. Usage: \`${client.settings.pre}report <meme id> <reason>\``);
    
    const i = args[0];

    posts.findOne({
      id: i,
      state: "POST_APPROVED"
    }, async (err, meme) => {
      if (err) console.log(err);

      // if (!meme) return msg.edit(replies.noMeme); (replied undefined)
      
      const t = ms(Date.now() - meme.uploadedAt);
      const time = convertTime(t);
      let title = meme.title;
      if (title === undefined) title = "Untitled";
      const user = await client.fetchUser(meme.authorID);

      const embed = new Discord.RichEmbed()
        .setAuthor(`Reported By ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL)
        .setTitle(`${title} - ${meme.upVotes} Likes / ${meme.downVotes} Dislikes`)
        .setDescription(`Reason: ${args.slice(1).join(" ")}`)
        .setImage(meme.url)
        .setColor(red)
        .setFooter(`<#${meme.id}>  Meme posted by ${user.tag} ${time} ago`, user.displayAvatarURL)
        .setTimestamp();
      client.channels.get(reports).send(embed);
      client.channels.get(logs).send(`🚩 **${message.author.tag}** (${message.author.id}) reported a post with id \`<#${meme.id}>\` submitted by **${user.tag}** (${user.id}).`)
      msg.edit(`Successfully reported meme: \`<#${meme.id}>\`.`);
      
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