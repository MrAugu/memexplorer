// const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
// const { typing } = require("../../data/emojis.json");
// const { invisible } = require("../../data/colors.json");
// const replies = require("../../data/replies.json");
// const servers = require("../models/server.js");
// const mongoose = require("mongoose");
// const mongoUrl = require("../..//tokens.json").mongodb;

// mongoose.connect(mongoUrl, {
//   useNewUrlParser: true
// });

// module.exports = {
//   name: "prefix",
//   description: "Set the prefix for the server",
//   usage: "<prefix>",
//   aliases: ['setprefix'],
//   async execute (client, message, args) {
//     if(!args[0]) {
//         servers.findOne({
//             serverID: message.guild.id
//         }, async (err, s) => {
//             if (err) console.log(err);
//             return message.channel.send(`The current prefix is ${s.prefix}`);
//         });
//     }
//     if(!args[0]) return;

//     if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(replies.noPerms);

//     let f = args[0].replace("_", " ");
//     const msg = await message.channel.send(`${typing} Settings prefix to ${f}...`);

//     servers.findOne({
//         serverID: message.guild.id
//     }, async (err, s) => {
//         if (err) console.log(err);
//         s.prefix = f;
//         await s.save().catch(e => console.log(e));
//         const embed = new Discord.RichEmbed()
//         .setAuthor(`${message.guild.name}`, message.guild.iconURL)
//         .setColor(invisible)
//         .setDescription(`Successfully set the prefix to \`${f}\``)
//         .setFooter(`If you were planning on adding a space at the end, substitue it with _ instead`);
//         msg.edit(embed);
//     });
//   },
// };