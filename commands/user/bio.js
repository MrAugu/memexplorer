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
  name: "bio",
  description: "Sets the user's bio.",
  usage: "<description>",
  args: true,
  cooldown: "60",
  aliases: ["setbio", "set-bio", "bioset"],
  async execute (client, message, args) {
    const msg = await message.channel.send(`${loading} Setting bio...`);
    if (args.join(" ").length > 200) return msg.edit(replies.bioLong);

    try {
      profiles.findOne({
        authorID: message.author.id
      }, async (err, user) => {
        if (err) console.log(err);
  
        if (!user) {
          const newUser = new profiles({
            authorID: message.author.id,
            bytes: 0,
            multiplier: false,
            bio: args.join(" "),
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
          return msg.edit(`Succesfully set your bio to \`${args.join(" ")}\``);
        }
  
        user.bio = args.join(" ");
        user.save().catch(e => console.log(e));
        return msg.edit(`Succesfully set your bio to \`${args.join(" ")}\``);
      });
    } catch (e) {
      msg.delete();
      client.commands.get("bio").execute(client, message, args);
      console.log(e);
      return;
    }
  },  
};