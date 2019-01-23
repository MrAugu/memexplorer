const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { downloading, rejected } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const { mods } = require("../settings.json");
const replies = require("../data/replies.json");
const prePosts = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;
const db = require("quick.db");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "reject",
  description: "reject a post",
  usage: "<id> <reason>",
  args: "true",
  cooldown: "5",
  aliases: ["r"],
  async execute (client, message, args) {
    if (!mods.includes(message.author.id)) return message.channel.send("You don't have permission to do that.");
    const msg = await message.channel.send(`${downloading} Rejecting post...`);

    const reason = args.slice(1).join(" ");
    if (!reason) return msg.edit(replies.noReason);

    prePosts.findOne({
      id: args[0],
      state: "POST_UNAPPROVED"
    }, async (err, post) => {
      if (err) console.log(err);

      if (!post) return msg.edit(replies.noId  + ` \`#${args[0]}\`.`);

      post.state = "POST_REJECTED";
      post.rejectedBy = message.author.id;

      client.memes.shift();

      post.save().catch(e => console.log(e));

      msg.edit(`Successfully rejected post with id \`#${post.id}\``);
      const user = await client.fetchUser(post.authorID);
      db.add(`rejectedMemes.${message.author.id}`, 1);
      client.channels.get(logs).send(`${rejected} **${message.author.tag}** (${message.author.id}) rejected a post with id \`#${post.id}\` submitted by **${user.tag}** (${user.id}). Reason: ${reason}`);
      try {
        user.send(`${rejected} **${message.author.tag}** has rejected your post with id \`#${post.id}\`. Reason: ${reason}`);
      } catch (e) {
        console.log(e);
      }
    });
  },
};