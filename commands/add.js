const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const { owner, currency, devs } = require("../settings.json");
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
  usage: "<user> <group(supporter, mod)>",
  args: true,
  async execute (client, message, args) {
    if (!devs.includes(message.author.id)) return message.channel.send(replies.noPerms);
    if(!args[0]) return message.channel.send("Please specifiy a user.")
    if(!args[1]) return message.channel.send("Please specify a group to add the user to.");
    if(args[1].toLowerCase() !== "supporter" && args[1].toLowerCase() !== "mod" && args[1].toLowerCase() !== "developer" && args[1].toLowerCase() !== "voter") return message.channel.send("That's not a valid group. Valid groups: supporoter, mod, voter, developer.")

    const msg = await message.channel.send(`${loading} Adding user to ${args[1]} group...`);

    const user = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!user) return msg.edit(replies.noUser);

    profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);
      if(args[1].toLowerCase() === "supporter"){
        u.supporter = true;
      } else if(args[1].toLowerCase() === "supporterr"){
        u.supporter = true;
        u.supporterr = true;
      } else if(args[1].toLowerCase() === "supporterrr"){
        u.supporter = true;
        u.supporterr = true;
        u.supporterrr = true;
      } else if(args[1].toLowerCase() === "mod"){
        u.mod = true;
      } else if(args[1].toLowerCase() === "voter"){
        u.voted = true;
      } else if(args[1].toLowerCase() === "developer"){
        u.developer = true;
      }

      const username = await client.fetchUser(u.authorID);
      msg.edit(`Added **${user.user.tag}** as a **${args[1]}**`)

      await u.save().catch(e => console.log(e));
    });
  },
};
