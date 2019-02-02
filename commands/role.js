const Discord = require("discord.js");
const { invisible } = require("../data/colors.json")
const { dblToken } = require("../tokens.json")
const DBL = require('dblapi.js')
const dbl = new DBL(dblToken, this.client)

module.exports = {
    name: 'role',
	async execute(client, message, args){
        try{
            if(message.guild.id === "529415233899593732" || message.guild.id === "529418106309705738" || message.guild.id === "533778546288754689" || message.guild.id === "473426453204172811" || message.guild.id === "538358426326138905" || message.guild.id === "536619560783314954"){
                dbl.hasVoted(message.author.id).then(voted => {
                    if (voted){
                        let member = message.member;
                        let role = message.guild.roles.find(`name`, `I voted`);
                        if(!role) return message.channel.send("Role not found.");
                      
                        if(member.roles.has(role.id)) return message.channel.send("You already have the role!");
                        member.addRole(role.id);
    
                        return message.channel.send("Successfully gave you the `I voted` role!");
                    } else {
                        const embed = new Discord.RichEmbed()
                        .setDescription("You must vote for the bot to use this command: https://discordbots.org/bot/530766901282996224/vote")
                        .setFooter("If you already voted give it 1 minute to process", message.author.displayAvatarURL)
                        .setTimestamp()
                        .setColor(invisible);
                        return message.channel.send(embed);	
                    }
                });
            } else {
                return message.channel.send("This guild doesn't have vote roles setup! Please ask `Tetra#0001` if you are interested in setting them up.")
            }
        } catch(e){
            console.log(e);
        }
	},
};