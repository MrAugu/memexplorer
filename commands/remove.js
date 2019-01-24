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
  name: "remove",
  description: "Removes a user from a specific group.",
  usage: "<user> <group(supporter, approver)>",
  args: true,
  async execute (client, message, args) {
    if (!owner.includes(message.author.id)) return message.channel.send("You don't have permission to do that.");
    if(!args[0]) return message.channel.send("Please specifiy a user.")
    if(!args[1]) return message.channel.send("Please specify a group to remove the user from.");
    if(args[1].toLowerCase() !== "supporter" && args[1].toLowerCase() !== "approver" && args[1].toLowerCase() !== "developer" && args[1].toLowerCase() !== "voter") return message.channel.send("That's not a valid group. Valid groups: supporoter, approver, voter, developer.")

    const msg = await message.channel.send(`${loading} Removing user from ${args[1]} group...`);

    const user = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!user) return msg.edit(replies.noUser);

    profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);
      if(args[1].toLowerCase() === "supporter"){
        u.supporter = false;
      } else if(args[1].toLowerCase() === "supporterr"){
        u.supporter = false;
        u.supporterr = false;
      } else if(args[1].toLowerCase() === "supporterrr"){
        u.supporter = false;
        u.supporterr = false;
        u.supporterrr = false;
      } else if(args[1].toLowerCase() === "approver"){
        u.approver = false;
      } else if(args[1].toLowerCase() === "voter"){
        u.voted = false;
      } else if(args[1].toLowerCase() === "developer"){
        u.developer = false;
      }

      const username = await client.fetchUser(u.authorID);
      msg.edit(`Removed **${user.user.tag}** from the group **${args[1]}**`)

      await u.save().catch(e => console.log(e));
    });
  },
};