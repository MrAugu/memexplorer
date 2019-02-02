const fs = require("fs");
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const tokens = require("./tokens.json");
const settings = require("./settings.json"); // eslint-disable-line no-unused-vars

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.memes = [];

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const log = async (message) => {
  console.log(`[${new Date().toLocaleString()}] - ${message}`);
};

const init = async () => {
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
  console.log(`Loaded a total of ${commandFiles.length} commands.`);
        
  const evtFiles = await readdir("./events/");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
  console.log(`Loaded a total of ${evtFiles.length} events.`);
};
init();

client.on("disconnect", () => log("Disconnecting..."));
client.on("reconnecting", () => log("Reconnecting..."));
client.on("error", e => log(e));
client.on("warn", w => log(w));

client.login(tokens.token);
