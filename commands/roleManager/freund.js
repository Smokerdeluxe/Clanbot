exports.run = async (client, message, args, Discord, config, errChannel) => {
  //Eingegebene Nachricht löschen?
  if (config.deleteRoleManager == `y`) message.delete(config.deleteTime * 1000);
  //commando: -freund neu @Smoker
  var rollen = ``;
  var aktion = [`neu`, `alt`];
  let member = message.mentions.members.first();


  var goodEmbed;
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

  var badEmbed;
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

  var warnEmbed;
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

  var pnEmbed;
  function privat(art, emoji, text) {
    pnEmbed = new Discord.RichEmbed()
      .setColor(`#FFFF00`)
      .setAuthor(
        art,
        `https://cdn.discordapp.com/emojis/` + emoji
      )
      .setDescription(text)
    member.send(pnEmbed)
      .then()
      .catch(console.error);
  }

  var logEmbed;
  function logging(text) {
    logEmbed = new Discord.RichEmbed()
      .setColor(`#0080FF`)
      .setAuthor(
        message.member.nickname + ` hat Rollen bearbeitet!`,
        `https://cdn.discordapp.com/emojis/645269154638856242.png`
      )
      .setDescription(text)
    errChannel.send(logEmbed)
      .then()
      .catch(console.error);
  }


  //++++++++++++++EINGABE PRÜFEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--arg "add" prüfen
  if (!args[0]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -freund **neu** ${message.author}`
  );
  var aktionname = args[0].toLowerCase();
  if (!aktion.includes(aktionname)) return fehler(
    `Falsche Aktion eingegeben!`,
    `Mögliche Aktionen sind: \n${aktion}`
  );

  //--arg "member" prüfen
  if (!member) return fehler(
    `Keinen Spieler markiert!`,
    `z.b. -freund neu ${message.author}`
  );

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//-----------------------------------------------------------
  //--Alle CR-Rollen suchen
  let freunde = message.guild.roles.get(`501405795548659712`);

  let musik = message.guild.roles.get(`524084224827850772`);
  let youTube = message.guild.roles.get(`526085042208768021`);
  let tempel = message.guild.roles.get(`523937763444129802`);
  let gaming = message.guild.roles.get(`591338966612049986`);
  let support = message.guild.roles.get(`625315681595949056`);
  let dachboden = message.guild.roles.get(`500417843989315624`);

  let clanratCR = message.guild.roles.get(`504709824630751232`);
  let clanratBS = message.guild.roles.get(`504709824630751232`);
  let clanratCoC = message.guild.roles.get(`504709824630751232`);


  //++++++++++++++ROLLE VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--Rolle hinzufügen
  if (aktionname === `neu`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanratCR.id) || message.member.roles.has(clanratBS.id) || message.member.roles.has(clanratCoC.id)) {
      //Clanrolle vergeben, wenn nicht vorhanden!
      if (member.roles.has(freunde.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${freunde} bereits!`);
      }
      else {
        member.addRole(freunde.id)
          .then(rollen = rollen + `${freunde} `)
          .catch(console.error);
      }
      fertig(`Rolle hinzugefügt!`, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen. \nSpieler wurde per PN benachrichtigt. \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Willkommen bei der Bergclan Familie!`, `652728425898835969.png`, `Die für dich relevanten Serverbereiche wurden freigeschaltet: 

**__Innenhof__**
Du hast nun Zutritt zum [Wegweiser](https://discordapp.com/channels/375761445184471050/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

Das :sos: ist z.B. der **Support-Bereich**, dort findest du Infos zum Server und zu Discord überhaupt! Für Discord Neulinge sehr zu empfehlen, auch für den ersten Einstig! (muss leider angeschalten werden!)

**__Schänke__**
Hier kommunizieren wir **ALLE** zusammen (Familie, Freunde und Gäste)! Du bist herzlich eingeladen im [Berg-Chat](https://discordapp.com/channels/375761445184471050/375762081632485376) dabei zu sein!

Viel Spaß beim umsehen, bei Fragen einfach melden, bis bald :wink:`);
      return logging(`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratCR}, ${clanratBS} oder ${clanratCoC} sein, um ${freunde} auf dem Server einzuteilen!`);
    }
  }

  //--Rolle entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanratCR.id) || message.member.roles.has(clanratBS.id) || message.member.roles.has(clanratCoC.id)) {
      //Clanrolle vergeben, wenn nicht vorhanden!
      if (!member.roles.has(freunde.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${freunde} nicht!`);
      }
      else {
        member.removeRole(freunde.id)
          .then(rollen = rollen + `${freunde} `)
          .catch(console.error);
      }

       if (member.roles.has(musik.id)) member.removeRole(musik.id)
        .then(rollen = rollen + `${musik} `)
        .catch(console.error);

      if (member.roles.has(youTube.id)) member.removeRole(youTube.id)
        .then(rollen = rollen + `${youTube} `)
        .catch(console.error);
        if (member.roles.has(tempel.id)) member.removeRole(tempel.id)
        .then(rollen = rollen + `${tempel} `)
        .catch(console.error);
        if (member.roles.has(gaming.id)) member.removeRole(gaming.id)
        .then(rollen = rollen + `${gaming} `)
        .catch(console.error);
        if (member.roles.has(support.id)) member.removeRole(support.id)
        .then(rollen = rollen + `${support} `)
        .catch(console.error);
        if (member.roles.has(dachboden.id)) member.removeRole(dachboden.id)
        .then(rollen = rollen + `${dachboden} `)
        .catch(console.error);


      fertig(`Rolle entfernt!`, `**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt. \nSpieler wurde per PN benachrichtigt. \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Nachricht der Bergclan Familie!`, `652728425898835969.png`, `Dir wurde die Rolle Freunde abgenommen!`);
      return logging(`**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt!`);

    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratCR}, ${clanratBS} oder ${clanratCoC} sein, um die Rolle ${freunde} entfernen zu können!`);
    }
  }
}
