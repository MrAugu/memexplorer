const fs = require("fs");
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const tokens = require("./tokens.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.memes = [];
client.settings = require("./settings.js");

const about = fs.readdirSync("./commands/about").filter(file => file.endsWith(".js"));
const fun = fs.readdirSync("./commands/fun").filter(file => file.endsWith(".js"));
const mod = fs.readdirSync("./commands/mod").filter(file => file.endsWith(".js"));
const dev = fs.readdirSync("./commands/dev").filter(file => file.endsWith(".js"));
const user = fs.readdirSync("./commands/user").filter(file => file.endsWith(".js"));
const config = fs.readdirSync("./commands/config").filter(file => file.endsWith(".js"));


const log = async (message) => {
  console.log(`[${new Date().toLocaleString()}] - ${message}`);
};

const init = async () => {
  try{
    let commandNum = 0;
    for (const file of about) {
      const aboutCommand = require(`./commands/about/${file}`);
      client.commands.set(aboutCommand.name, aboutCommand);
      commandNum++;
    }
    for (const file of user) {
      const userCommand = require(`./commands/user/${file}`);
      client.commands.set(userCommand.name, userCommand);
      commandNum++;
    }
    for (const file of fun) {
      const funCommand = require(`./commands/fun/${file}`);
      client.commands.set(funCommand.name, funCommand);
      commandNum++;
    }
    for (const file of mod) {
      const modCommand = require(`./commands/mod/${file}`);
      client.commands.set(modCommand.name, modCommand);
      commandNum++;
    }
    for (const file of dev) {
      const devCommand = require(`./commands/dev/${file}`);
      client.commands.set(devCommand.name, devCommand);
      commandNum++;
    }
    for (const file of config) {
      const configCommand = require(`./commands/config/${file}`);
      client.commands.set(configCommand.name, configCommand);
      commandNum++;
    }
    console.log(`Loaded a total of ${commandNum} commands.`);
          
    const evtFiles = await readdir("./events/");
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      const event = new (require(`./events/${file}`))(client);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
    console.log(`Loaded a total of ${evtFiles.length} events.`);
  }catch(e){
    console.log(e);
  }
};
init();

client.on("disconnect", () => log("Disconnecting..."));
client.on("reconnecting", () => log("Reconnecting..."));
client.on("error", e => log(e));
client.on("warn", w => log(w));

client.login(tokens.token);
