const { ready } = require('../data/channels.json');
const posts = require("../models/post.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    console.log(`${this.client.user.username} is online. Running on ${this.client.guilds.size} servers`);
    this.client.channels.get(ready).send(`${this.client.user.username} has restarted. Running on \`${this.client.guilds.size}\` servers.`);

    let memeCount = await posts.countDocuments();
    this.client.user.setActivity(`with ${memeCount} memes`);
  }
};
