const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading } = require("../data/emojis.json");
const replies = require("../data/replies.json");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "bio",
  description: "Sets the user's bio.",
  usage: "<description>",
  args: true,
  cooldown: "60",
  aliases: ["setbio", "set-bio", "bioset"],
  async execute (client, message, args) {
    const msg = await message.channel.send(`${loading} Setting bio...`);
    if (args.join(" ").length > 200) return msg.edit(replies.bioLong);

    profiles.findOne({
      authorID: message.author.id
    }, async (err, user) => {
      if (err) console.log(err);

      if (!user) {
        const newUser = new profiles({
          authorID: message.author.id,
          wiiPoints: 0,
          bio: args.join(" ")
        });

        await newUser.save().catch(e => console.log(e));
        return msg.edit(`Succesfully set your bio to \`${args.join(" ")}\``);
      }

      user.bio = args.join(" ");
      user.save().catch(e => console.log(e));
      return msg.edit(`Succesfully set your bio to \`${args.join(" ")}\``);
    });
  },  
};