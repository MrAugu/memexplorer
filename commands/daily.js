const Discord = require('discord.js');
const { invisible } = require("../data/colors.json");
const { loading, currencyEmoji } = require("../data/emojis.json");
const db = require('quick.db');
const ms = require('parse-ms');
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

module.exports = {
    name: "daily",
    description: "Earn a random number of Bytes every 24 hours.",
    aliases: ['bytes'],
    async execute (client, message, args) {
        const msg = await message.channel.send(`${loading} Sending daily reward...`);

        let cooldown = 8.64e+7;
        let lastDaily = await db.fetch(`lastDaily.${message.author.id}`);
        if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
            let timeObj = ms(cooldown - (Date.now() - lastDaily));
            return msg.edit(`You can collect your daily in **${timeObj.hours} hours, and ${timeObj.minutes} minutes from now.**`)        
        } else {
            let randomAmount = Math.floor((Math.random() * 15) + 5);
            profiles.findOne({
                authorID: message.author.id,
            }, async (err, res) => {
                if (err) console.log(err);
                res.bytes += randomAmount;  
                await res.save().catch(e => console.log(e));
            });
            
            const embed = new Discord.RichEmbed()
            .setColor(invisible)
            .setDescription(`${currencyEmoji} You earned **${randomAmount} Bytes** from your daily reward!`)
            .addField(`Want more rewards?`, `[You can get 10 more bytes by just voting here](https://discordbots.org/bot/530766901282996224/vote)`)
            .setThumbnail(message.author.displayAvatar);
            db.set(`lastDaily.${message.author.id}`, Date.now());
            return msg.edit(embed);
        }
    },
};