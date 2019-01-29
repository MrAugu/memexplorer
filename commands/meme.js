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
    const msg = await message.channel.send(`${loading} Fetching meme...`);
    try {
      if (!args[0]) {
        const count = await posts.countDocuments();
        let memeIndex = Math.floor((Math.random() * count));
        if (memeIndex === 0) memeIndex = 1;

        posts.findOne({
          id: memeIndex,
          state: "POST_APPROVED"
        }, async (err, meme) => {
          if (err) console.log(err);

          profiles.findOne({
            authorID: meme.authorID
          }, async (er, res) => {
            if (er) console.log(er);

            res.bytes += 1;    

            if (!meme) return msg.edit(replies.meme);
          
            meme.votes.push(message.author.tag);

            await meme.save().catch(e => console.log(e));

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
              .setAuthor(`${meme.upVotes} Likes / ${meme.downVotes} Dislikes`)
              .setTitle(`**${title}**`)
              .setImage(meme.url)
              .setColor(invisible)
              .setFooter(`<#${meme.id}>  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL);
            msg.edit(embed);

            await msg.react(upvote);
            await msg.react(downvote);
           
            const collector = msg.createReactionCollector((reaction, user) => user !== client.user);
            collector.on('collect', async (messageReaction) => {
            //  if(r.users.last().id === user.id){
            //r.remove(user.id);
                const chosen = messageReaction.emoji.name;
                if(chosen === upvote){
                  meme.upVotes += 1;
                  res.bytes += 1;
                }
                if(chosen === downvote){
                  meme.downVotes += 1;
                }
            

                meme.save().catch(e => console.log(e));
                res.save().catch(e => console.log(e));
                collector.stop(); //collect only 1 reaction to avoid abuse
            });
          });        
        });
      } else if (args[0]) {
        const memeIndex = args[0];

        posts.findOne({
          id: memeIndex,
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
            .setAuthor(`${meme.upVotes} Likes / ${meme.downVotes} Dislikes`)
            .setTitle(`**${title}**`)
            .setImage(meme.url)
            .setColor(invisible)
            .setFooter(`<#${meme.id}>  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL);
          msg.edit(embed);   
        });
      }
      
    } catch (error) {
      console.log(error);
      msg.edit(`${replies.error}\n\`\`\`${error}\`\`\``);
    }
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
