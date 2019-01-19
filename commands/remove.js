const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { invisible } = require("../data/colors.json"); // eslint-disable-line no-unused-vars
const { loading, rejected } = require("../data/emojis.json");
const { mods } = require("../settings.json");
const replies = require("../data/replies.json");
const posts = require("../models/post.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "remove",
  description: "Removes a post from the database",
  args: true,
  usage: "<id>",
  async execute (client, message, args) {
    if (!mods.includes(message.author.id)) return;
    const msg = await message.channel.send(`${loading} Removing post...`);

    const reason = args.slice(1).join(" ");
    if (!reason) return msg.edit(replies.noReason);

    posts.findOne({
      id: args[0]
    }, async (err, post) => {
      if (!post) return msg.edit("Couldn't find any post with this id.");
      posts.findOneAndDelete({ id: post.id });

      const user = await client.fetchUser(post.authorID);
      msg.edit(`Deleted post \`#${post.id}\` from database.`);
      client.channels.get(logs).send(`🗑 **${message.author.tag}** (${message.author.id}) removed a post with id \`#${post.id}\` submitted by **${user.tag}** (${post.authorID}). Reason: ${reason}`);
      try {
        user.send(`Your post with \`#${post.id}\` has been deleted by \`${message.author.tag}\`. Reason: ${reason}`);
      } catch (e) {
        console.log(e);
      }
    });
  },  
};