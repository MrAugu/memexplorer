// setInterval

// const Discord = require("discord.js");
// const ms = require("parse-ms"); 
// const db = require("quick.db");
// const { invisible } = require("../../data/colors.json");
// const { loading, upvote, downvote } = require("../../data/emojis.json"); 
// const servers = require("../../models/server.js");
// const posts = require("../../models/post.js");
// const profiles = require("../../models/profiles.js");
// const mongoose = require("mongoose");
// const mongoUrl = require("../../tokens.json").mongodb;

// mongoose.connect(mongoUrl, {
//     useNewUrlParser: true
// });
// module.exports = {
//     name: "feed",
//     description: "Sets up a feed of memes in your desired channel.",
//     cooldown: "5",
//     args: true,
//     usage: "<channel>",
//     async execute (client, message, args) { 

//         if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`You must have the \`Manage Channels\` permission to use this command.`);

//         const oMsg = await message.channel.send(`${loading} Setting up meme-feed...`);

//         let feedChannel;
//         if(message.mentions.channels.first() === undefined){
//             if(!isNaN(args[0])) feedChannel = args[0];
//             else return oMsg.edit("No channel detected.");
//         } else {
//             feedChannel = message.mentions.channels.first().id;
//         }

//         servers.findOne({
//             serverID: message.guild.id
//         }, async (err, s) => {
//             if (err) console.log(err);
//             if (!s) {
//                 const newSever = new servers({
//                   serverID: message.guild.id,
//                   prefix: "e.",
//                   feed: "",
//                   ignore: [],                    
//                 });
//                 await newSever.save().catch(e => console.log(e));
//             }
    
//             s.feed = feedChannel;
//             await s.save().catch(e => console.log(e));
//             const embed = new Discord.RichEmbed()
//             .setAuthor(`${message.guild.name}`, message.guild.iconURL)
//             .setColor(invisible)
//             .setDescription(`**I wil now start sending memes to ${args[0]}**\nTip: You can disable the meme feed by doing ${s.prefix}feed ${args[0]}`);
//             oMsg.edit(embed);
//         });

//         setInterval(async function(){
//             let msg;
//             servers.findOne({
//                 serverID: message.guild.id
//             }, async (err, s) => {
//                 if (err) console.log(err);
//                 if (!s) {
//                     const newSever = new servers({
//                       serverID: message.guild.id,
//                       prefix: "e.",
//                       feed: "",
//                       ignore: [],               
//                     });
//                     await newSever.save().catch(e => console.log(e));
                    
//                 }
        
//                 msg = await client.channels.get(feedChannel).send(`${loading} Fetching meme...`);
//                 await s.save().catch(e => console.log(e));
//             });

//             let count = await posts.countDocuments();
//             let idNum = Math.round(Math.random() * count);
//             let res = await posts.findOne({ id: idNum, state: "POST_APPROVED" });
//             try {
//                 while(!res || res === undefined || res.id == null){
//                     idNum = Math.round(Math.round() * count);
//                     res = await posts.findOne({ id: idNum, state: "POST_APPROVED" });
//                 }
//                 if (res === undefined || !res) return msg.delete();;
//             } catch (erro) {
//                 msg.delete();
//                 console.log(erro);
//                 return;
//             }
        
//             profiles.findOne({
//                 authorID: res.authorID
//             }, async (err, u) => {
//                 if (err) console.log(err);
        
//                 const t = ms(Date.now() - res.uploadedAt);
//                 const time = convertTime(t);
//                 let title = res.title;
//                 if (title === undefined || args.join(" ").length > 100) title = "Untitled";
//                 const user = await client.fetchUser(res.authorID);
        
//                 if(res.type === undefined) res.type = "img";
//                 if(res.type === "img") {
//                     const embed = new Discord.RichEmbed()
//                     .setAuthor(`${res.upVotes} Likes / ${res.downVotes} Dislikes`)
//                     .setTitle(`**${title}**`)
//                     .setImage(res.url)
//                     .setColor(invisible)
//                     .setFooter(`<#${res.id}>  Posted by ${user.tag} ${time} ago`, user.displayAvatarURL);
//                     msg.edit(embed);
        
//                     await msg.react(upvote);
//                     await msg.react(downvote);
        
//                     const filter = (r, usr) => r.emoji.name === upvote || r.emoji.name === downvote || usr.id !== client.user.id || usr.id !== res.authorID;
//                     const collector = msg.createReactionCollector(filter, { time: 120000 });
//                     collector.on("collect", (r) => {
//                         if (r.users.last().id === user.id) {
//                             r.remove(user.id);
//                         } else {
//                             if (r.users.last().id !== client.user.id) {
//                                 if (r.emoji.name === upvote) {
//                                     const multiplierLength = 43200000;
//                                     res.upVotes += 1;
//                                     const lastMultiplier = db.fetch(`lastMultiplier.${user.id}`, Date.now());
//                                     if (lastMultiplier !== null && multiplierLength - (Date.now() - lastMultiplier) > 0) {
//                                         if(u && u != undefined) u.bytes += 2;
//                                     } else {
//                                         if(u && u != undefined) u.bytes += 1;
//                                     }
//                                 } 
//                                 if (r.emoji.name === downvote) {
//                                     res.downVotes += 1;
//                                     if(u && u != undefined) u.bytes -= 2;
//                                 }
//                             }
//                         }
//                     });
        
//                     collector.on("end", async c => { 
//                         await res.save().catch(e => console.log(e));
//                         if(u && u != undefined) await u.save().catch(e => console.log(e));
//                     });
//                 }
//             })
//         }, 500000); //5 minutes

//     },
// };


// function convertTime (time) {
//   let timeInt;
//   let timeString;
//   if (time.days == 0) {
//     if (time.hours == 0) {
//       if (time.minutes == 0) {
//         timeInt = time.seconds;
//         timeString = " second(s)";
//       } else {
//         timeInt = time.minutes;
//         timeString = " minute(s)";
//       }
//     } else {
//       timeInt = time.hours;
//       timeString = " hour(s)";
//     }
//   } else {
//     timeInt = time.days;
//     timeString = " day(s)";
//   }

//   const timeVar = timeInt + timeString;
//   return timeVar;
// }
