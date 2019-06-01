const Discord = require("discord.js");
const { invisible } = require("../../data/colors.json");
const { dblToken } = require("../../tokens.json");
const emoji = require("../../data/emojis.json");
const replies = require("../../data/replies.json");
const profiles = require("../../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;

const DBL = require("dblapi.js");
const dbl = new DBL(dblToken, this.client);

module.exports = {
  name: "role",
  async execute (client, message, args) { 
    if (message.guild.id === "533766168318705676" || message.guild.id === "529415233899593732" || message.guild.id === "529418106309705738" || message.guild.id === "533778546288754689" || message.guild.id === "473426453204172811" || message.guild.id === "538358426326138905" || message.guild.id === "536619560783314954") {
        profiles.findOne({
        authorID: message.author.id
        }, async (err, u) => {
        if (err) console.log(err);
        let ranks = "";
        if (!u) {
            const newUser = new profiles({
            authorID: message.author.id,
            bytes: 0,
            multiplier: false,
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
            .setDescription("You must vote for the bot to use this command: https://discordbots.org/bot/530766901282996224/vote")
            .setFooter("If you already voted give it 1 minute to process", message.author.displayAvatarURL)
            .setTimestamp()
            .setColor(invisible);
            return message.channel.send(embed);	
        } else {
            if (u.voted) {
                const member = message.member;
                const role = message.guild.roles.find("name", "Memexplorer Lover");
                if (!role) return message.channel.send("Role not found.");
                        
                if (member.roles.has(role.id)) return message.channel.send("You already have the role!");
                member.addRole(role.id);
        
                return message.channel.send("Successfully gave you the role!");
            } else {
                const embed = new Discord.RichEmbed()
                .setDescription("You must vote for the bot to use this command: https://discordbots.org/bot/530766901282996224/vote")
                .setFooter("If you already voted give it 1 minute to process", message.author.displayAvatarURL)
                .setTimestamp()
                .setColor(invisible);
                return message.channel.send(embed);	
            }
        }
        });
    } else {
        return message.channel.send("This guild doesn't have vote roles setup! Please ask `Tetra#0001` if you are interested in setting them up.");
    }
  },
};