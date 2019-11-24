module.exports = (client, message) => {

  const config = require("./../commands/config.json");

  // Wenn Inhalt nicht mit Prefix beginnt oder Bot ist, STOP
  if (message.content.indexOf(config.prefix) !== 0 || message.author.bot) return;

  // KürzePrefix, Leerzeichen, Trenne bei "leer"
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);

  // Erstes Argument (Kommando) löschen, Alles klein machen wg. CoMmaND
  const command = args.shift().toLowerCase();

  // NEU
  const cmd = client.commands.get(command);

  // Wenn Kommando nicht vorhanden, STOP
  if (!cmd) return;

  const Discord = require(`discord.js`);
  const errChannel = client.channels.get(config.errChannId);


  // Run the command
  cmd.run(client, message, args, Discord, config, errChannel);
};