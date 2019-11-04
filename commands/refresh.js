exports.run = (client, message, args) => {

  // Berechtigung für?
  const modRole = message.guild.roles.find(role => role.name === `Baumeister`);
  if (!modRole) return message.reply(`Die Rolle **${modRole.name}** ist nicht vorhanden.`);
  if (!message.member.roles.has(modRole.id)) return message.reply(`\nDieses Kommando is nur für **${modRole.name}**.`);

  if (!args[0]) return message.reply(`\nEs muss ein Kommando eingegeben werden, das aktualisiert/hinzugefügt werden soll.`);
  const commandName = args[0];
  const fs = require(`fs`);

  //Aktualisieren/Hinzufügen von scripten  
  var file = `./commands/` + commandName;
  fs.access(file, fs.constants.F_OK, (err) => {
    if (err) {

      // Check if the file exists in the current directory.
      if (err.code === `ENOENT`) {
        return message.reply(`\nDie Datei ${commandName} kann nicht aktualisiert/hinzugefügt werden... Falsch geschrieben???`);
        return;
      }
      throw err;
    }

    delete require.cache[require.resolve(`./${commandName}`)];
    // We also need to delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}`);
    client.commands.set(commandName, props);
    message.reply(`\nDie Datei ${commandName} wurde aktualisiert/hinzugefügt!`);
  });
};