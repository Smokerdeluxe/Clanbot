exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {
  //Eingegebene Nachricht löschen?
  if (config.deleteRoleManager == `y`) message.delete(config.deleteTime * 1000);
  //commando: -freund neu @Smoker

  //++++++++++++++EINGABE PRÜFEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--arg "add" prüfen
  if (!args[0]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -freund **neu** ${message.author}`
  );
  var aktion = [`neu`, `alt`];
  var aktionname = args[0].toLowerCase();
  if (!aktion.includes(aktionname)) return fehler(
    `Falsche Aktion eingegeben!`,
    `Mögliche Aktionen sind: \n${aktion}`
  );

  //--arg "member" prüfen
  let member = message.mentions.members.first();
  if (!member) return fehler(
    `Keinen Spieler markiert!`,
    `z.b. -freund neu ${message.author}`
  );

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//-----------------------------------------------------------
  //--Alle CR-Rollen suchen
  let freunde = message.guild.roles.get(config.freunde);

  let musik = message.guild.roles.get(`524084224827850772`);
  let youTube = message.guild.roles.get(`526085042208768021`);
  let tempel = message.guild.roles.get(`523937763444129802`);
  let gaming = message.guild.roles.get(`591338966612049986`);
  let support = message.guild.roles.get(`625315681595949056`);
  let dachboden = message.guild.roles.get(`500417843989315624`);

  let clanrat = message.guild.roles.get(config.clanrat);


  //++++++++++++++ROLLE VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  var rollen = ``;
  //--Rolle hinzufügen
  if (aktionname === `neu`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanrat.id)) {
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
      privat(`Willkommen bei der Bergclan Familie!`, config.emojiCR, `Die für dich relevanten Serverbereiche wurden freigeschaltet: 

**__Innenhof__**
Du hast nun Zutritt zum [Wegweiser](https://discordapp.com/channels/375761445184471050/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

Das :sos: ist z.B. der **Support-Bereich**, dort findest du Infos zum Server und zu Discord überhaupt! Für Discord Neulinge sehr zu empfehlen, auch für den ersten Einstig! (muss leider angeschalten werden!)

**__Schänke__**
Hier kommunizieren wir **ALLE** zusammen (Familie, Freunde und Gäste)! Du bist herzlich eingeladen im [Berg-Chat](https://discordapp.com/channels/375761445184471050/375762081632485376) dabei zu sein!`, `Viel Spaß beim umsehen...`, `Bei Fragen einfach melden, bis bald :wink:`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole,`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} sein, um ${freunde} auf dem Server einzuteilen!`);
    }
  }

  //--Rolle entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanrat.id)) {
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
      privat(`Nachricht der Bergclan Familie!`, config.emojiCR, `Dir wurde die Rolle Freunde abgenommen!`, `\u200b`, `\u200b`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole,`**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt!`);

    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} sein, um die Rolle ${freunde} entfernen zu können!`);
    }
  }
}
