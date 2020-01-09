exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {
  //Eingegebene Nachricht löschen?
  if (config.deleteRoleManager == `y`) message.delete(config.deleteTime * 1000);
  //commando: -freund neu @Smoker
  
  //++++++++++++++EINGABE PRÜFEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--arg "add" prüfen
  if (!args[0]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -partner **neu** ${message.author}`
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
    `z.b. -partner neu ${message.author}`
  );

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//-----------------------------------------------------------
  //--Alle CR-Rollen suchen
  let partner = message.guild.roles.get(config.partner);

  let turnier = message.guild.roles.get(config.turnier);
  let pn = message.guild.roles.get(config.pn);
  let verify = message.guild.roles.get(`541675601975836712`);

  let clanrat = message.guild.roles.get(config.clanrat);
  
  //++++++++++++++ROLLE VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  var rollen = ``;
  //--Rolle hinzufügen
  if (aktionname === `neu`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanrat.id)) {
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
      privat(`Willkommen bei der Bergclan Familie!`, config.emojiCR, `Um dich als Turnierpartner freizuschalten, sieh dir das <#541643055963439106> an (falls noch nicht geschehen) und bestätige unten mit **allen Emojis/Reaktionen, __von links nach rechts__**! \n\nDann sind die für dich relevanten Serverbereiche freigeschaltet:

**__Innenhof__**
Dann hast du Zutritt zum [Wegweiser](${config.chanLink}/${message.guild.id}/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

**🏆 Turnierpartner 🏆**
Dann findest du im Turnierberich, alle wichtigen Infos zu [Terminen](${config.chanLink}/${message.guild.id}/542306142886559753) die du brauchst. Schau mal in den [Turnierpartner-Chat](${config.chanLink}/${message.guild.id}/541660234649960448), dort kannst du dich mit allen Turnierpartnern austauschen.`, `Viel Spaß beim umsehen...`, `Bei Fragen einfach melden, bis bald :wink:`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole,`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} sein, um ${partner} auf dem Server einzuteilen!`);
    }
  }

  //--Rolle entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat
    if (message.member.roles.has(clanrat.id)) {
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
      privat(`Nachricht der Bergclan Familie!`, config.emojiCR, `Dir wurde die Rolle Turnierpartner abgenommen!`, `\u200b`, `\u200b`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole,`**${member.displayName}** wurde/n die Rolle/n ${rollen} entfernt!`);

    }
    else {
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} sein, um  die Rolle ${partner} entfernen zu können!`);
    }
  }
}
