const { loading } = require("../data/emojis.json");
const { mods } = require("../settings.json");
const { logs } = require("../data/channels.json");
const replies = require("../data/replies.json");
const posts = require("../models/post.js");
const profiles = require("../models/profiles.js");
const mongoose = require("mongoose");
const mongoUrl = require("../tokens.json").mongodb;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true
});

module.exports = {
  name: "delete",
  description: "Deletes a post from the database",
  args: true,
  usage: "<id>",
  async execute (client, message, args) {
    profiles.findOne({
        authorID: message.author.id
      }, async (err, u) => {
        if (err) console.log(err);
        if(!u.approver) {
          return message.channel.send("You don't have permission to do that.");
        } else {
            const msg = await message.channel.send(`${loading} Deleting post...`);

            const reason = args.slice(1).join(" ");
            if (!reason) return msg.edit(replies.noReason);
        
            posts.findOne({
                id: args[0],
                state: "POST_APPROVED"
            }, async (err, post) => {
                if (!post) return msg.edit("Couldn't find any post with this id.");
            
                post.state = "POST_DELETED";
                post.deletedBy = message.author.id;
                
                await post.save().catch(e => console.log(e));
                const user = await client.fetchUser(post.authorID);
                msg.edit(`Deleted post \`#${post.id}\` from database.`);
                client.channels.get(logs).send(`🗑 **${message.author.tag}** (${message.author.id}) deleted a post with id \`#${post.id}\` submitted by **${user.tag}** (${post.authorID}). Reason: ${reason}`);
                try {
                await user.send(`🗑 Your post with \`#${post.id}\` has been deleted by \`${message.author.tag}\`. Reason: ${reason}`);
                } catch (e) {
                return;
                }
            });
        }
    });
  },  
};