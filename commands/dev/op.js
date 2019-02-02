const Discord = require("discord.js");
const { loading } = require("../../data/emojis.json");
const replies = require("../../data/replies.json");
const profiles = require("../../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "op",
  description: "Give/take money from a user.",
  usage: "<user> <set/take/give> <amount>",
  args: true,
  async execute (client, message, args) {
    if (!client.settings.devs.includes(message.author.id)) return message.channel.send(replies.noPerms);
    const msg = await message.channel.send(`${loading} Editing profile...`);

    if((args[1].toLowerCase() !== "set" && args[1].toLowerCase() !== "take" && args[1].toLowerCase() !== "give") || !args[1]) return msg.edit("Please privde an action. Actions: set, take, give.")
    if(!args[2]) return msg.edit("Please provide an amount.");

    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (!user) return msg.edit(replies.noUser);

    let action = args[1].toLowerCase();
    let amount = args[2].toLowerCase();
    if(isNaN(amount)) return msg.edit("The amount you provided was not a number.");

    profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);

      if (!u) {
        const newUser = new profiles({
          authorID: user.id,
          bytes: 0,
          bio: "No bio set",
          totalPosts: 0,
          blacklisted: false,
          voted: false,
          supporter: false,
          supporterr: false,
          supporterrr: false,
          mod: false,
          developer: false,
        });
        await newUser.save().catch(e => console.log(e));
      }

      if(action === "set") u.bytes = amount;
      if(action === "give") u.bytes += amount;
      if(action === "take") u.bytes -= amount;
      await u.save().catch(e => console.log(e));

      return msg.edit(`**${user.user.tag}** now has ${u.bytes} ${client.settings.currency}.`)
    });
  },
};