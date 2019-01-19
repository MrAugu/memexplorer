const Discord = require("discord.js");
const ms = require("parse-ms"); // eslint-disable-line no-unused-vars
const { invisible } = require("../data/colors.json");
const { loading, upvote, downvote } = require("../data/emojis.json"); // eslint-disable-line no-unused-vars
const replies = require("../data/replies.json");
const posts = require("../models/post.js");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "meme",
  description: "Displays a meme,",
  cooldown: "5",
  usage: "<id of post>",
  async execute (client, message, args) {
    try {
      const msg = await message.channel.send(`${loading} Fetching meme...`);

      if (!args[0]) {
        const count = await posts.countDocuments();
        let memeIndex = Math.floor((Math.random() * count));
        if (memeIndex === 0) memeIndex = 1;

        posts.findOne({
          id: memeIndex
        }, async (err, meme) => {
          if (err) console.log(err);

          if (!meme) return msg.edit(replies.meme);
          
          const t = ms(Date.now() - meme.uploadedAt);
          const time = convertTime(t);

          const votes = meme.upVotes - meme.downVotes;
          const user = await client.fetchUser(meme.authorID);
          const embed = new Discord.RichEmbed()
          .setAuthor(`${votes} Vote(s)`)
          .setImage(meme.url)
          .setColor(invisible)
          .setFooter(`#${meme.id}  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL)
          .setTimestamp();
          msg.edit(embed);

          await msg.react("⬆");
          await msg.react("⬇");
          const filter = (r) => r.emoji.name === "⬆" || r.emoji.name === "⬇";
          const collector = msg.createReactionCollector(filter, { time: 120000 });
          collector.on("collect", r => {
            if (r.emoji.name === "⬆") meme.upVotes += 1;
            else if (r.emoji.name === "⬇") meme.downVotes += 1;
          });
          collector.on("end", c => meme.save().catch(e => console.log(e))); // eslint-disable-line no-unused-vars          
        });
      } else if (args[0]) {
        const memeIndex = args[0];

        posts.findOne({
          id: memeIndex
        }, async (err, meme) => {
          if (err) console.log(err);

          if (!meme) return msg.edit(replies.noMeme);
          
          const t = ms(Date.now() - meme.uploadedAt);
          const time = convertTime(t);

          const votes = meme.upVotes - meme.downVotes;
          const user = await client.fetchUser(meme.authorID);
          const embed = new Discord.RichEmbed()
          .setAuthor(`${votes} Vote(s)`)
          .setImage(meme.url)
          .setColor(invisible)
          .setFooter(`#${meme.id}  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL)
          .setTimestamp();
          msg.edit(embed);

          await msg.react("⬆");
          await msg.react("⬇");
          const filter = (r) => r.emoji.name === "⬆" || r.emoji.name === "⬇";
          const collector = msg.createReactionCollector(filter, { time: 120000 });
          collector.on("collect", r => {
            if (r.emoji.name === "⬆") meme.upVotes += 1;
            else if (r.emoji.name === "⬇") meme.downVotes += 1;
          });

          profiles.findOne({
            authorID: meme.authorID
          }, async (err, res) => {
            if (err) console.log(err);

            res.wiiPoints += 1;
            await res.save().catch(e => console.log(e));
          });

          collector.on("end", c => meme.save().catch(e => console.log(e))); // eslint-disable-line no-unused-vars          
        });
      }
      
    } catch (error) {
      console.log(error);
      msg.edit(`${replies.error}\n\`\`\`${error}\`\`\``);
    }
  },  
};

function convertTime(time){
  let timeInt;
  let timeString;
  if(time.days == 0){
    if(time.hours == 0){
      if(time.minutes == 0){
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

  let timeVar = timeInt + timeString;
  return timeVar;
}