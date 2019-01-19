const util = require("util"); // eslint-disable-line no-unused-vars
const exec = require("child_process").exec;
const { devs } = require("../settings.json");

module.exports = {
  name: "exec",
  description: "Executes to console.",
  args: true,
  usage: "<code>",
  async execute (client, message, args) {
    if (!devs.includes(message.author.id)) return message.channel.send("You're not allowed to do that!");
    
    try {
      let dir = null;
      dir = exec(message.content.split(" ").slice(1).join(" "), function (err, stdout, stderr) { // eslint-disable-line no-unused-vars
        if (err) return message.channel.send(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
        message.channel.send(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`${stdout}\`\`\``).catch(err => { // eslint-disable-line no-unused-vars
          message.channel.send(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`${stdout.substr(0, 1500)}\`\`\``);
        });
      });
  
      dir.on("exit", function (code) { // eslint-disable-line no-unused-vars
        // Smh
      });
  
    } catch (err) {
      message.channel.send(`:inbox_tray: Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\n:outbox_tray: Output:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
    }

  },  
};