const DBL = require("dblapi.js");
const Discord = require("discord.js");
const { dblToken } = require("./tokens.json");
const { invisible } = require("./data/colors.json");
const { voteLogs } = require("./data/channels.json");
const profiles = require("./models/profiles.js");
const { dblAuth } = require("./tokens.json");
const db = require("quick.db");

module.exports.startUp = async (client) => {
  const dbl = new DBL(dblToken, { webhookPort: 5000, webhookAuth: dblAuth });

  dbl.webhook.on("ready", async (hook) => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
  });
  dbl.webhook.on("vote", async (voter) => {
    try {
      const person = await client.fetchUser(voter.user);
      const embed = new Discord.RichEmbed()
        .setAuthor(`${person.tag} - (${voter.user})`, person.displayAvatarURL)
        .setDescription(`**${person.username}** voted for the bot!`)
        .setColor(invisible)
        .setTimestamp();
      client.channels.get(voteLogs).send(embed);
  
      profiles.findOne({
        authorID: voter.user
      }, async (err, u) => {
        if (err) console.log(err);
        if (!u) {
          const newUser = new profiles({
            authorID: voter.user,
            bytes: 0,
            multiplier: true,
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
          await newUser.save().catch(e => console.log(e));
        } else {
          u.bytes += 10;
          u.multiplier = true;
          db.set(`lastMultiplier.${voter.user}`, Date.now());
          await u.save().catch(e => console.log(e));
        }

        await person.send("Thank you for voting for **Memexplorer**! I sent you **10 bytes** to your profile, and I've activated your Bytes multiplier, you will now get x2 Bytes! (You can vote again in 12 hours to get more bytes!)");
      });
    } catch (e) {
      console.log(e);
    }1
