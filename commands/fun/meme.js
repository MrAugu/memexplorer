const Discord = require("discord.js");
const ms = require("parse-ms"); // eslint-disable-line no-unused-vars
const db = require("quick.db");
const { invisible } = require("../../data/colors.json");
const { loading, upvote, downvote } = require("../../data/emojis.json"); // eslint-disable-line no-unused-vars
const posts = require("../../models/post.js");
const profiles = require("../../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});
module.exports = {
  name: "meme",
  description: "Displays a meme,",
  cooldown: "5",
  usage: "<id of post>",
  async execute (client, message, args) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`${loading} Fetching meme...`);

    if (!args[0]) {
      const count = await posts.countDocuments();
      const id = Math.round(Math.random() * count);

      const res = await posts.findOne({ id: id, state: "POST_APPROVED" });
      if (!res) return msg.edit("This meme might have been removed from database. Please try again.");
      if (res === null) return msg.edit("This meme might have been removed from database. Please try again.");

      profiles.findOne({
        authorID: res.authorID
      }, async (err, u) => {
        if (err) console.log(err);
        if (err) return msg.edit("An internal error occured while running this command. Please try again.");
        if (!u) return msg.edit("An internal error occured while running this command. Please try again.");
        u.bytes += 1;

        const t = ms(Date.now() - res.uploadedAt);
        const time = convertTime(t);
        let title = res.title;
        if (title === undefined) title = "Untitled";
        const user = await client.fetchUser(res.authorID);

        const embed = new Discord.RichEmbed()
          .setAuthor(`${res.upVotes} Likes / ${res.downVotes} Dislikes`)
          .setTitle(`**${title}**`)
          .setImage(res.url)
          .setColor(invisible)
          .setFooter(`<#${res.id}>  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL);
        msg.edit(embed);

        await msg.react(upvote);
        await msg.react(downvote);

        const filter = (r, usr) => r.emoji.name === upvote || r.emoji.name === downvote || usr.id !== client.user.id || usr.id !== res.authorID;
        const collector = msg.createReactionCollector(filter, { time: 120000 });
        collector.on("collect", (r) => {
          if (r.users.last().id === user.id) {
            r.remove(user.id);
          } else {
            if (r.users.last().id !== client.user.id) {
              if (r.emoji.name === upvote) {
                const multiplierLength = 43200000;
                res.upVotes += 1;
                const lastMultiplier = db.fetch(`lastMultiplier.${message.author.id}`, Date.now());
                if (lastMultiplier !== null && multiplierLength - (Date.now() - lastMultiplier) > 0) {
                  u.bytes += 2;
                } else {
                  u.bytes += 1;
                }
              } 
              if (r.emoji.name === downvote) {
                res.downVotes += 1;
                u.bytes -= 2;
              }
            }
          }
        });

        collector.on("end", async c => { // eslint-disable-line no-unused-vars
          await res.save().catch(e => console.log(e));
          await u.save().catch(e => console.log(e));
        });
      });
    } if (args[0]) {
      const res = await posts.findOne({ id: args[0], state: "POST_APPROVED" });
      if (!res) return msg.edit("This meme might have been removed from database. Please try again.");
      if (res === null) return msg.edit("This meme might have been removed from database. Please try again.");

      const t = ms(Date.now() - res.uploadedAt);
      const time = convertTime(t);
      let title = res.title;
      if (title === undefined) title = "Untitled";
      const user = await client.fetchUser(res.authorID);
      const embed = new Discord.RichEmbed()
        .setAuthor(`${res.upVotes} Likes / ${res.downVotes} Dislikes`)
        .setTitle(`**${title}**`)
        .setImage(res.url)
        .setColor(invisible)
        .setFooter(`<#${res.id}>  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL);
      msg.edit(embed);

    }
  }
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