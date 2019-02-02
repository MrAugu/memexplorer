const { ready } = require('../data/channels.json');
const { status, testing } = require('../settings.json');
const dblHandler = require("../dbl.js");
const { dblToken } = require("../tokens.json");
const DBL = require("dblapi.js");
const dbl = new DBL(dblToken, this.client);

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    console.log(`${this.client.user.username} is online. Running on ${this.client.guilds.size} servers`);
    this.client.channels.get(ready).send(`${this.client.user.username} has restarted. Running on \`${this.client.guilds.size}\` servers.`);
    this.client.user.setActivity(status);

    if(testing) return;
    dblHandler.startUp(this.client);
    dbl.postStats(this.client.guilds.size);
  
  }
};
