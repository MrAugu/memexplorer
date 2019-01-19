const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;
const posts = require("../models/post.js");
const users = require("../models/profiles.js");
const { invisible } = require("../data/colors.json");
const { loading } = require("../data/emojis.json");
const Discord = require("discord.js");

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "popular",
  description: "View the memes with the most upvotes.",
  cooldown: "5",
  async execute (client, message, args) {
    const msg = await message.channel.send(`${loading} Fetching popular posts...`)

    posts.find().sort([["upVotes", "descending"]]).exec(async (err, res) => {
        if (err) console.log(err);
        const lb = [];

        for (var i = 0; i < 10; i++) {
            try {
            const user = await client.fetchUser(res[i].authorID);
            lb.push(`**${i+1}.** \`ID: #${res[i].id}\` posted by **${user.tag}** with **${res[i].upVotes} upvotes**`);
            } catch (e) {} // eslint-disable-line no-empty
        }

        const embed = new Discord.RichEmbed()
        .setAuthor("Global Leaderboard", client.user.avatarURL)
        .setDescription(`${lb.join("\n")}`)
        .setTimestamp()
        .setColor(invisible);
        msg.edit(embed);
    });
  },
};
