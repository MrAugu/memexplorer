// const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
// const { loading, blacklist } = require("../../data/emojis.json");
// const { logs } = require("../../data/channels.json");
// const replies = require("../../data/replies.json");
// const profiles = require("../models/profiles.js");
// const mongoose = require("mongoose");
// const mongoUrl = require("../../tokens.json").mongodb;

// mongoose.connect(mongoUrl, {
//   useNewUrlParser: true
// });

// module.exports = {
//   name: "blacklist",
//   description: "Blacklists a user from the bot",
//   usage: "<user> <reason>",
//   args: true,
//   async execute (client, message, args) {
//     profiles.findOne({
//         authorID: message.author.id
//     }, async (err, person) => {
//         if (err) console.log(err);
//         if(!person.mod) {
//           return message.channel.send(replies.noPerms);
//         } else {
//             if(!args[0]) return message.channel.send("Please specifiy a user.")
//             const reason = args.slice(1).join(" ");
//             if (!reason) return message.channel.send(replies.noReason);

//             const msg = await message.channel.send(`${loading} Blacklisting user from bot...`);

//             const user = message.mentions.members.first() || message.guild.members.get(args[0]);
//             if (!user) return msg.edit(replies.noUser);

//             profiles.findOne({
//                 authorID: user.id
//             }, async (err, u) => {
//                 if (err) console.log(err);
//                 if(u.blacklisted == null) u.blacklisted = false;
//                 if(u.blacklisted){
//                     return msg.edit("That user is already blacklisted.");
//                 } else if(!u.blacklisted && !u.mod && !u.developer && !u.owner){
//                     u.blacklisted = true;
//                 }

//                 const username = await client.fetchUser(u.authorID);
//                 msg.edit(`Blacklisted **${user.user.tag}** from the bot.`)
//                 client.channels.get(logs).send(`${blacklist} **${message.author.tag}** (${message.author.id}) blacklisted **${user.user.tag}** (${user.id}). Reason: ${reason}`);
//                 await u.save().catch(e => console.log(e));
//             });
//         }
//     });
//   },
// };