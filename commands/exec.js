const exec = require("child_process").exec;

module.exports = {
  name: "exec",
  description: "Executes to console.",
  args: true,
  usage: "<code>",
  async execute (client, message, args) {
    if (!client.settings.owner.includes(message.author.id)) return message.channel.send("Only the devs can use the `exec` command.");
    
    try {
      let dir = null;
      dir = exec(message.content.split(" ").slice(1).join(" "), function (err, stdout, stderr) { // eslint-disable-line no-unused-vars
        if (err) return message.channel.send(`Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\nOutput:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
        message.channel.send(`Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\nOutput:\n\`\`\`${stdout}\`\`\``).catch(err => { // eslint-disable-line no-unused-vars
          message.channel.send(`Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\nOutput:\n\`\`\`${stdout.substr(0, 1500)}\`\`\``);
        });
      });
  
      dir.on("exit", function (code) { // eslint-disable-line no-unused-vars

      });
  
    } catch (err) {
      message.channel.send(`Input:\n\`\`\`js\n${args.join(" ")}\n\`\`\`\n\nOutput:\n\`\`\`xl\n${err.toString()}\n\`\`\``);
    }

  },  
};