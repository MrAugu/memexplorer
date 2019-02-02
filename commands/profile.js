const Discord = require("discord.js");
const { invisible } = require("../data/colors.json");
const emoji = require("../data/emojis.json");
const replies = require("../data/replies.json");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "profile",
  description: "Displays the user's profile",
  usage: "<user>",
  async execute (client, message, args) {
    const msg = await message.channel.send(`${emoji.loading} Fetching profile...`);

    const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    if (!user) return msg.edit(replies.noUser);

    profiles.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);
      let ranks = "";
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
        newUser.save().catch(e => console.log(e));
        const embed = new Discord.RichEmbed()
        .setThumbnail(user.user.displayAvatarURL)
        .addField("User", `${user.user.tag}`, true)
        .addField(client.settings.currency, `${emoji.currencyEmoji} 0`, true)
        .addField("Bio", `No bio set`)
        .setFooter(`0 posts`)
        .setColor(invisible)
        .setTimestamp();
        return msg.edit(embed);
      } else {
        if(u.voted) ranks += " " + emoji.voted;
        if(u.supporter) ranks += " " + emoji.supporter;
        if(u.mod) ranks += " " + emoji.mod;
        if(u.developer) ranks += " " + emoji.developer;

        const embed = new Discord.RichEmbed()
        .setThumbnail(user.user.displayAvatarURL)
        .addField("User", `${user.user.tag}${ranks}`, true)
        .addField(client.settings.currency, `${emoji.currencyEmoji} ${u.bytes}`, true)
        .addField("Bio", `${u.bio}`)
        .setFooter(`${u.totalPosts} posts`)
        .setColor(invisible)
        .setTimestamp();
      return msg.edit(embed);
      }
    });
  },
};