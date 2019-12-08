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
  let partner = message.guild.roles.get(`538585439620169728`);

  let turnier = message.guild.roles.get(`573951535642574848`);
  let pn = message.guild.roles.get(`500429154190360586`);
  let verify = message.guild.roles.get(`541675601975836712`);

  let clanratCR = message.guild.roles.get(`504709824630751232`);

  //++++++++++++++ROLLE VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--Rolle hinzufügen
  if (aktionname === `neu`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanratCR.id)) {
      //Clanrolle vergeben, wenn nicht vorhanden!
      if (member.roles.has(partner.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${partner} bereits!`);
      }
      else {
        member.addRole(partner.id)
          .then(rollen = rollen + `${partner} `)
          .catch(console.error);
      }
      fertig(`Rolle hinzugefügt!`, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen. \nSpieler wurde per PN benachrichtigt. \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Willkommen bei der Bergclan Familie!`, `652728425898835969.png`, `Um dich als Turnierpartner freizuschalten, sieh dir das <#541643055963439106> an und bestätige unten mit allen **Emojis/Reaktionen, __von links nach rechts__**! \n\nDann sind die für dich relevanten Serverbereiche freigeschaltet:

**__Innenhof__**
Dann hast du Zutritt zum [Wegweiser](https://discordapp.com/channels/375761445184471050/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

**🏆 Turnierpartner 🏆**
Dann findest du im Turnierberich, alle wichtigen Infos zu [Terminen](https://discordapp.com/channels/375761445184471050/542306142886559753) die du brauchst. Schau mal in den [Turnierpartner-Chat](https://discordapp.com/channels/375761445184471050/541660234649960448), dort kannst du dich mit allen Turnierpartnern austauschen.

Viel Spaß beim umsehen, bei Fragen einfach melden, bis bald :wink:`);
      return logging(`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratCR} sein, um ${partner} auf dem Server einzuteilen!`);
    }
  }

  //--Rolle entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanratCR.id)) {
      //Clanrolle vergeben, wenn nicht vorhanden!
      if (!member.roles.has(partner.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${partner} nicht!`);
      }
      else {
        member.removeRole(partner.id)
          .then(rollen = rollen + `${partner} `)
          .catch(console.error);
      }

       if (member.roles.has(turnier.id)) member.removeRole(turnier.id)
        .then(rollen = rollen + `${turnier} `)
        .catch(console.error);

      if (member.roles.has(pn.id)) member.removeRole(pn.id)
        .then(rollen = rollen + `${pn} `)
        .catch(console.error);
        if (member.roles.has(verify.id)) member.removeRole(verify.id)
        .then(rollen = rollen + `${verify} `)
        .catch(console.error);

      fertig(`Rolle entfernt!`, `**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt. \nSpieler wurde per PN benachrichtigt. \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Nachricht der Bergclan Familie!`, `652728425898835969.png`, `Dir wurde die Rolle Turnierpartner abgenommen!`);
      return logging(`**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt!`);

    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratCR} sein, um  die Rolle ${partner} entfernen zu können!`);
    }
  }
}
