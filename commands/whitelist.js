const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const { loading, whitelist } = require("../data/emojis.json");
const { logs } = require("../data/channels.json");
const replies = require("../data/replies.json");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "whitelist",
  description: "Whitelists a user from the bot",
  usage: "<user>",
  args: true,
  async execute (client, message, args) {
    profiles.findOne({
        authorID: message.author.id
    }, async (err, person) => {
        if (err) console.log(err);
        if(!person.mod) {
          return message.channel.send(replies.noPerms);
        } else {
            if(!args[0]) return message.channel.send("Please specifiy a user.")

            const msg = await message.channel.send(`${loading} Whitelisting user from bot...`);

            const user = message.mentions.members.first() || message.guild.members.get(args[0]);
            if (!user) return msg.edit(replies.noUser);

            profiles.findOne({
                authorID: user.id
            }, async (err, u) => {
                if (err) console.log(err);
                if(u.blacklisted == null) u.blacklisted = false;
                if(!u.blacklisted){
                    return msg.edit("That user is already whitelisted.");
                } else if(u.blacklisted){
                    u.blacklisted = false;
                }

                const username = await client.fetchUser(u.authorID);
                msg.edit(`Whitelisted **${user.user.tag}** from the bot.`)
                client.channels.get(logs).send(`${whitelist} **${message.author.tag}** (${message.author.id}) whitelisted **${user.user.tag}** (${user.id}).`);
                await u.save().catch(e => console.log(e));
            });
        }
    });
  },
};