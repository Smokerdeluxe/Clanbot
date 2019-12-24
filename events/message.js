module.exports = (client, message) => {

  const config = require("./../config.json");

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

  let logEmbed;
  let goodEmbed;
  let badEmbed;
  let warnEmbed;
  let pnEmbed;
    
  function logging(art, emoji, text) {
    logEmbed = new Discord.RichEmbed()
      .setColor(`#0080FF`)
      .setAuthor(
        art,
        `https://cdn.discordapp.com/emojis/` + emoji
      )
      .setDescription(text)
    errChannel.send(logEmbed)
      .then()
      .catch(console.error);
  }

   
  function fertig(art, text) {
    goodEmbed = new Discord.RichEmbed()
      .setColor(`#04B404`)
      .setAuthor(
        `Fertig! ` + art,
        `https://cdn.discordapp.com/emojis/645360655553265664.png`
      )
      .setDescription(text)
    message.channel.send(goodEmbed)
      .then(msg => { msg.delete(config.deleteTime * 1000) })
      .catch(console.error);
  }
  
  function fehler(art, text) {
    badEmbed = new Discord.RichEmbed()
      .setColor(`#DF0101`)
      .setAuthor(
        `Fehler! ` + art,
        `https://cdn.discordapp.com/emojis/645357169968939054.png`
      )
      .setDescription(text)
    message.channel.send(badEmbed)
      .then(msg => { msg.delete(config.deleteTime * 1000) })
      .catch(console.error);
  }
  
  function warnung(art, text) {
    warnEmbed = new Discord.RichEmbed()
      .setColor(`#FFFF00`)
      .setAuthor(
        `Warnung! ` + art,
        `https://cdn.discordapp.com/emojis/645360592919592970.png`
      )
      .setDescription(text)
    message.channel.send(warnEmbed)
      .then(msg => { msg.delete(config.deleteTime * 1000) })
      .catch(console.error);
  }
  
  function privat(art, emoji, text, art2, leader) {
    pnEmbed = new Discord.RichEmbed()
      .setColor(`#42423f`)
      .setAuthor(
        art,
        `https://cdn.discordapp.com/emojis/` + emoji
      )
      .setDescription(text)
      .addField (art2, leader)
    message.mentions.members.first().send(pnEmbed)
      .then()
      .catch(console.error);
  }

  // Run the command
  cmd.run(client, message, args, Discord, config, fehler, logging, fertig, warnung, privat);
};
