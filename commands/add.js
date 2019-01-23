const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const { owner, currency } = require("../settings.json");
const profiles = require("../models/profiles.js");
const replies = require("../data/replies.json");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;
const db = require("quick.db");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "add",
  description: "Adds a user to a specific group.",
  usage: "<group (supporter, approver)> <user>",
  args: true,
  async execute (client, message, args) {
    if (!owner.includes(message.author.id)) return message.channel.send("You don't have permission to do that.");
    if(args[0] != "supporter" || args[0] != "approver") return message.channel.send("That's not a valid group. Valid groups: Supporter, Approver.")
    if(!args[1]) return message.channel.send("Please specifiy a user for me to add to this group.")

    const msg = await message.channel.send(`${loading} Adding user to ${args[0]} group...`);

    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (!user) return msg.edit(replies.noUser);

    profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);

      const embed = new Discord.RichEmbed()
        .setThumbnail(user.user.displayAvatarURL)
        .addField("User", `${user.user.tag}`, true)
        .addField(currency, `${wiiP} ${u.wiiPoints}`, true)
        .addField("Bio", `${u.bio}`)
        .setFooter(`${u.totalPosts} posts`)
        .setColor(invisible)
        .setTimestamp();
      return msg.edit(embed);
    });


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