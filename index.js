const fs = require("fs");
const Discord = require('discord.js');

const client = new Discord.Client({
  intents: ['GUILDS'],
});

require('./utils/functions')(client);
require("dotenv").config()

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.login(process.env.TOKEN);