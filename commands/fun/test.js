const Discord = require("discord.js");
const { invisible } = require("../../data/colors.json");
const emoji = require("../../data/emojis.json");
const replies = require("../../data/replies.json");
const profiles = require("../../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../../tokens.json").mongodb;
const Canvas = require('canvas');

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "test",
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
          .setThumbnail(user.user.displayAvatarURL)
          .addField("User", `${user.user.tag}`, true)
          .addField(client.settings.currency, `${emoji.currencyEmoji} 0`, true)
          .addField("Bio", "No bio set")
          .setFooter("0 posts")
          .setColor(invisible)
          .setTimestamp();
        return msg.edit(embed);
      } else {
        // if (u.voted) ranks += " " + emoji.voted;
        // if (u.supporter) ranks += " " + emoji.supporter;
        // if (u.mod) ranks += " " + emoji.mod;
        // if (u.developer) ranks += " " + emoji.developer;

        // const embed = new Discord.RichEmbed()
        //   .setThumbnail(user.user.displayAvatarURL)
        //   .addField("User", `${user.user.tag}${ranks}`, true)
        //   .addField(client.settings.currency, `${emoji.currencyEmoji} ${u.bytes}`, true)
        //   .addField("Bio", `${u.bio}`)
        //   .setFooter(`${u.totalPosts} posts`)
        //   .setColor(invisible)
        //   .setTimestamp();

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/533779992828575767/579843930355400725/edd57b4af20cefd582baf650ce5a2ca4.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        // Select the font size and type from one of the natively available fonts
        ctx.font = '40px Impact';
        // Select the style that will be used to fill the text in
        ctx.fillStyle = '#ffffff';
        // Actually fill the text with a solid color
        ctx.font = applyText(canvas, `${user.user.tag}!`);
        ctx.fillText(user.user.tag, canvas.width / 2.5, canvas.height / 1.8);
        ctx.fillStyle = '#e5e5e5';
        ctx.font = '30px Impact';
        ctx.fillText(`${client.settings.currency}: ${u.bytes}`, canvas.width / 2.5, canvas.height / 1.4);
    
        // Pick up the pen
        ctx.beginPath();
        // Start the arc to form a circle
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // Put the pen down
        ctx.closePath();
        // Clip off the region you drew on
        ctx.clip();
    
        
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL);
        ctx.drawImage(avatar, 25, 25, 200, 200);
        
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
        
        msg.delete();
        message.channel.send(`bruh`, attachment);

      }
    });
    
  },
};

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};
