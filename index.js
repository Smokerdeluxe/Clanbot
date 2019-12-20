const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const keep_alive = require("./keep_alive.js");
const client = new Discord.Client();
var jezt = 0;
client.commands = new Enmap();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Kommando ${commandName} erfolgreich geladen`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/roleManager/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/roleManager/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Rollenzuweisung für ${commandName} erfolgreich geladen`);
    client.commands.set(commandName, props);
  });
});

client.login(process.env.DISCORD_BOT_SECRET);
