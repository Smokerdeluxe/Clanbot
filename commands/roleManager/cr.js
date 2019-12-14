exports.run = async (client, message, args, Discord, config, errChannel) => {
  //Eingegebene Nachricht löschen?
  if (config.deleteRoleManager == `y`) message.delete(config.deleteTime * 1000);
  //commando: -cr feste add @Smoker
  var rollen = ``;
  var clans = config.clansCR;
  var aktion = [`neu`, `alt`, `kick`, `rat`, `clanrat`];
  let member = message.mentions.members.first();
  let user = message.mentions.users.first();


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
  //--arg "feste" prüfen
  if (!args[0]) return fehler(
    `Kein Clan erkannt!`,
    `Du hast den Clan, hinter -spiel nicht eingegeben! \nz.b. -cr **feste** neu ${message.author}`
  );
  var clanname = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
  var clannameS = args[0].toLowerCase();
  var clanmogl = clans.join(", ");
  if (!clans.some(r => clans.includes(clanname))) return fehler(
    `Clan ${args[0]} existiert nicht!`,
    `Mögliche Clans sind: \n${clanmogl}`
  );

  //--arg "add" prüfen
  if (!args[1]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -cr feste **neu** ${message.author}`
  );
  var aktionname = args[1].toLowerCase();
  if (!aktion.includes(aktionname)) return fehler(
    `Falsche Aktion eingegeben!`,
    `Mögliche Aktionen sind: \n${aktion}`
  );
  if (aktionname === `rat` && clanname === config.clansCR[0]) return warnung(
    `Falschen Clan eingegeben!`,
    `Das Berglager hat keinen Ältestenrat!`
  );
  if (aktionname === `clanrat` && clanname === config.clansCR[0]) return warnung(
    `Falschen Clan eingegeben!`,
    `Das Berglager hat keinen Clanrat!`
  );

  //--arg "member" prüfen
  if (!member) return fehler(
    `Keinen Spieler markiert!`,
    `z.b. -cr feste neu ${message.author}`
  );

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//-----------------------------------------------------------
  //--Alle CR-Rollen suchen
  let fam = message.guild.roles.get(`636541297473224725`);
  let game = message.guild.roles.get(`625337054670356490`);
  let kammer = message.guild.roles.get(`500429304006574081`);
  let turnier = message.guild.roles.get(`573951535642574848`);
  let pn = message.guild.roles.get(`500429154190360586`);
  let freunde = message.guild.roles.get(`501405795548659712`);
  let altenrat = message.guild.roles.get(`507632542724128789`);
  let clanrat = message.guild.roles.get(`504709824630751232`);

  //--Entsprechende Clanrolle suchen
  for (const nr in clans) {
    if (clanname === clans[nr]) {
      var clan = message.guild.roles.find(r => r.name === `👑 Berg` + clannameS);
      var rat = message.guild.roles.find(r => r.name === `👑 Älteste 🏔️` + clanname);
      var leitung = rat.members.filter(m => m.roles.has(clanrat.id)).map(u => u.user.id);
      var fuhrung = rat.members.filter(m => m.roles.has(clanrat.id)).map(u => u.nickname).join("\n");
      var fuhrungPing = rat.members.filter(m => m.roles.has(clanrat.id)).map(u => `${u.user}`).join("\n");
    }
  }

  //++++++++++++++ROLLEN VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--Rollen hinzufügen
  if (aktionname === `neu`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id) && message.member.roles.has(rat.id)) {
      //Clanrolle vergeben, wenn nicht vorhanden!
      if (member.roles.has(clan.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${clan} bereits!`);
      }
      else {
        member.addRole(clan.id)
          .then(rollen = rollen + `${clan} `)
          .catch(console.error);
      }
      //Familienrolle vergeben, wenn nicht vorhanden!
      if (member.roles.has(fam.id)) {
        fertig(`Rolle hinzugefügt!`,
          `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen. \nSpieler wurde per PN benachrichtigt. \nBitte nicht vergessen den **Nickname anzupassen!**`);
        privat(`Rolle wurde hinzugefügt!`, `599526611787710484.png`, `Wilkommen im Clan **${clan.name}**! Da du ja bereits in der **${fam.name}** warst, muss ich ja nicht viel erklären und wünsche dir viel Spass und Erfolg! \n\n__Deine Clanführung:__ \n${fuhrungPing}`);
        return logging(`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
      }
      else {
        member.addRole(fam.id)
          .then(rollen = rollen + `${fam} `)
          .catch(console.error);
      }
      //Zusatzrollen vergeben, wenn nicht vorhanden!
      if (!member.roles.has(game.id)) member.addRole(game.id)
        .then(rollen = rollen + `${game} `)
        .catch(console.error);
      if (!member.roles.has(kammer.id)) member.addRole(kammer.id)
        .then(rollen = rollen + `${kammer} `)
        .catch(console.error);
      if (!member.roles.has(turnier.id)) member.addRole(turnier.id)
        .then(rollen = rollen + `${turnier} `)
        .catch(console.error);
      if (!member.roles.has(pn.id)) member.addRole(pn.id)
        .then(rollen = rollen + `${pn} `)
        .catch(console.error);
      fertig(`Rollen hinzugefügt!`, `**${member.displayName}** folgende Rollen hinzugefügt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Willkommen bei der Bergclan Familie!`, `599526611787710484.png`,
        `Der Clan **${clan.name}** hat dich aufgenommen. Die für dich relevanten Serverbereiche wurden freigeschaltet: 

**__Innenhof__**
Du hast nun Zutritt zum [Wegweiser](https://discordapp.com/channels/375761445184471050/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

Das :sos: ist z.B. der **Support-Bereich**, dort findest du Infos zum Server und zu Discord überhaupt! Für Discord Neulinge sehr zu empfehlen, auch für den ersten Einstig! (muss leider angeschalten werden!)

**__Schänke__**
Hier kommunizieren wir **ALLE** zusammen (Familie, Freunde und Gäste)! Du bist herzlich eingeladen im [Berg-Chat](https://discordapp.com/channels/375761445184471050/375762081632485376) dabei zu sein!

**__👑 Clash Royale 👑__**
Hier ist die CR Community vereint. Der Bereich bietet einen [Chat](https://discordapp.com/channels/375761445184471050/636520754455904256), [Karten Handelsplatz](https://discordapp.com/channels/375761445184471050/520584395552456705), [Freundeslink Kanal](https://discordapp.com/channels/375761445184471050/399109081295749120) für clanübergreifende Duos und Testspiele, [Präsentationsraum der CR Clans](https://discordapp.com/channels/375761445184471050/647029292634603521), u.v.m...

Frag da gerne alles was du möchtest. Auch, wenn du bspw. eine Deckberatung zu deinem Clankrieg Deck brauchst.

Auch die Bereiche Waffenkammer (Tutorials zu Decktypen etc.) und Turniere (Infos zur Turnierpartnerschaft; mtl. Turnier mit 40+ Clans, evt. mit Prämie) gehören zur CR Welt dazu.

Nähere Infos zu einem Kanal (Zweck, wer schreibt hier usw.) findest du in der Kanalbeschreibung (vom rechten Rand nach links wischen, Textfeld ganz oben)

Melde dich, wenn du einer anderen Gaming Sparte beitreten möchtest, damit wir dir weitere Serverbereiche freischalten können. Wir sind auch in Clash of Clans und Brawl Stars vertreten. 

Viel Spaß beim umsehen, bei Fragen einfach melden, bis bald :wink:

__Deine Clanführung:__ \n${fuhrungPing}`
      );
      return logging(`**${member.displayName}** wurden folgende Rollen hinzugefügt: \n${rollen}`)
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** einzuteilen, ist aber nicht berechtigt. Diese Nachricht wurde auch an deine anderen Vize gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. einteilen! \nFür Spieler aus einem Familienclan gehe dazu in <#375762081632485376>, für neue Spieler gehe dazu in <#500399456861028352> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-cr ${clannameS} neu @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} und ${rat} sein, um Leute für ${clan} einzuteilen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** einteilen!`);
    }
  }

  //--Rollen entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id) && message.member.roles.has(rat.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(clan.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${clan} nicht!`);
      }
      else {
        member.removeRole(clan.id)
          .then(rollen = rollen + `${clan} `)
          .catch(console.error);
        fertig(`Rolle entfernt!`,
          `**${member.displayName}** wurde die Rolle ${rollen} wurde entfernt! \nBitte nicht vergessen den **Nickname anzupassen!**`);
        return logging(`**${member.displayName}** wurde die Rolle ${rollen} entfernt!`);
      }
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** zu entfernen, ist aber nicht berechtigt. Diese Nachricht wurde auch an deine anderen Vize gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. entfernen! \nGehe dazu in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-cr ${clannameS} alt @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} und ${rat} sein, um Leute von ${clan} zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** entfernen bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Clan-Kick---------------------------------------------------------------------------------------------
  if (aktionname === `kick`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id) && message.member.roles.has(rat.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(clan.id)) {
        return warnung(`Es wurde nichts geändert!`,
          `**${member.displayName}** hat die Rolle ${clan} nicht!`);
      }
      else {
        member.removeRole(clan.id)
          .then(rollen = rollen + `${clan} `)
          .catch(console.error);
      }
      //Alle anderen Rollen entferne, wenn vorhanden
      if (member.roles.has(fam.id)) member.removeRole(fam.id)
        .then(rollen = rollen + `${fam} `)
        .catch(console.error);
      if (member.roles.has(game.id)) member.removeRole(game.id)
        .then(rollen = rollen + `${game} `)
        .catch(console.error);
      if (member.roles.has(kammer.id)) member.removeRole(kammer.id)
        .then(rollen = rollen + `${kammer} `)
        .catch(console.error);
      if (member.roles.has(turnier.id)) member.removeRole(turnier.id)
        .then(rollen = rollen + `${turnier} `)
        .catch(console.error);
      if (member.roles.has(pn.id)) member.removeRole(pn.id)
        .then(rollen = rollen + `${pn} `)
        .catch(console.error);
      if (member.roles.has(rat.id)) member.removeRole(rat.id)
        .then(rollen = rollen + `${rat} `)
        .catch(console.error);
      if (member.roles.has(altenrat.id)) member.removeRole(altenrat.id)
        .then(rollen = rollen + `${altenrat} `)
        .catch(console.error);
      if (member.roles.has(clanrat.id)) member.removeRole(clanrat.id)
        .then(rollen = rollen + `${clanrat} `)
        .catch(console.error);
      if (!member.roles.has(freunde.id)) member.addRole(freunde.id)
        .then(rollen = rollen + `Die Rolle ${freunde} wurde zugewiesen!`)
        .catch(console.error);
      fertig(`Rollen entfernt!`, `**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wurdest auf **${freunde.name}** zurückgestetzt. Wenn du wieder einem unserer Clans beitreten möchtest, nimm Kontakt zu jmd. aus der Clanführung auf: \n\n${fuhrungPing}`);
      return logging(`**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen}`);
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** zu entfernen und aus der **${fam.name}** zu kicken, ist aber nicht berechtigt. Diese Nachricht wurde auch an deine anderen Vize gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. kicken! \nGeh in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-cr ${clannameS} kick @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} und ${rat} sein, um Leute von ${clan} zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** kicken bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Ältestenrat entfernen/hinzufügen----------------------------------------------------------------------
  if (aktionname === `rat`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id) && message.member.roles.has(rat.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(altenrat.id)) {
        member.addRole(altenrat.id)
          .then(rollen = rollen + `${altenrat} `)
          .catch(console.error);
        member.addRole(rat.id)
          .then(rollen = rollen + `und ${rat}`)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt im ${rollen}! Der Einleitungstext zur Aufgabenbeschreibung wurde per PN gesendet!`);
        privat(`Willkommen im ${altenrat.name}!`, `599526611787710484.png`, `Deine Aufgabe besteht darin, deinen Clan am laufen zu halten, inaktive Spieler auszusortieren (der Clanleitung melden), aktiv an der Clangestaltung mitzuwirken und den Clanchat zu beleben! Ein bisschen wie ein Animateur, aber eher einfach ein gutes Vorbild :wink:

Wenn dir jemand auffällt, der Urlaub in den Clanchat geschrieben hat, evtl. aber nicht auf Discord ist, trage dies bitte [hier](https://discordapp.com/channels/375761445184471050/393909321169108993) ein.

Am [schwarzen Brett](https://discordapp.com/channels/375761445184471050/646274646097920021) findest du wichtige Infos, die du deinem Clan im Chat mitteilen solltest (Falls noch nicht geschehen, oder untergegangen)! 

Neuankömmlinge im Clan werden begrüßt, begleitet und evtl. zu Discord "geführt" um das ganze Clangeschehen mitzubekommen! 

Ein <#375762362789265408> ist genau der richtige Ort, an dem sich alle Ältesten austauschen können. So könnt ihr euch über Probleme und Schwachstellen in euren Clans austauschen und sehen was du evtl. besser machen kannst. Alle "Chef-Ältesten" erreichst du mit @${clanrat.name}.

Im <#380061588201406465> könnt ihr ungestört miteinander sprechen :wink:`);
        return logging(`**${member.displayName}** wurden die Rollen ${rollen} zugewiesen!`);
      }
      if (!member.roles.has(rat.id)) {
        member.addRole(rat.id)
          .then(rollen = rollen + `${rat} `)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen! Da die Rolle ${altenrat} bereits vorhanden war, wurde nur eine PN zur Aufnnahme gesendet! Kein Einleitungstext!`);
        privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest befördert und bist nun **${rat.name}**! Schau dir den Regierungsberich unterhalb des CR-Bereich an, er variiert bei den Clans!`);
        return logging(`**${member.displayName}** wurde/n die Rolle/n ${rollen} zugewiesen!`);
      }
      if (member.roles.has(rat.id)) {
        member.removeRole(rat.id)
        fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle  ${rat} abgenommen! Es wurde eine PN zur Info gesendet!`);
        privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest degradiert und bist nun kein **${rat.name}** mehr! Bei Fragen wende dich an die Clanführung: \n\n${fuhrungPing}`
        );
        return logging(`**${member.displayName}** wurde die Rolle ${rat} abgenommen!`);
      }
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als **${rat.name}** hinzuzufügen/zu entfernen, ist aber nicht berechtigt. Diese Nachricht wurde auch an deine anderen Vize gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. nhizufügen/entfernen! \nGehe dazu in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-cr ${clannameS} rat @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} und ${rat} sein, um Älteste von ${clan} hinzuzufügen/zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** als Älteste/n hinzufügen/entfernen bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Clanrat entfernen/hinzufügen--------------------------------------------------------------------------
  if (aktionname === `clanrat`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id) && message.member.roles.has(rat.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(clanrat.id)) {
        member.addRole(clanrat.id)
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt ${clanrat}!`);
        privat(`Willkommen im ${clanrat.name}`, `599526611787710484.png`, `Der Clanrat besteht aus Leader und einem Vize, aus jedem Clan! Ihr seid die **Chef-Ältesten**, achtet auf die anderen Ältesten und handelt übergeordnet! Hier wird über Verbundbeitritte oder Clan Neugründungen diskutiert und entschieden!

Erfülle deine bisherigen Aufgaben weiter so gut wie bisher und tausche dich mit deinen und anderen Ältesten aus! Du bist jetzt das **Bindeglied** zwischen deinem **Clan** und der **Clanfamilie!**

Falls du **personelle oder technische** Probleme im Clan hast (Membermangel, Fusionspartner, Änderungen/Wünsche zu Discord, etc.), melde dich im <#504709207753228288> , hier kümmern wir uns um Clan übergreifende Dinge wie **Personal/Technik/Forum.** Nur der Clanrat kann in diesen Chat! Uns alle erreicht man mit @${clanrat.name}.

Im <#506914804280328192> könnt ihr ungestört miteinander sprechen falls nötig. :wink:`);
        return logging(`**${member.displayName}** wurde die Rolle ${clanrat} zugewiesen!`);
      }
      if (member.roles.has(clanrat.id)) {
        member.removeRole(clanrat.id)
        fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle ${clanrat} abgenommen!`);
        privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest degradiert und bist nun kein **${clanrat.name}** mehr! Bei Fragen wende dich an die Clanführung: \n\n${fuhrungPing}`);
        return logging(`**${member.displayName}** wurde die Rolle ${clanrat} abgenommen!`);
      }
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als **${clanrat.name}** hinzuzufügen/zu entfernen, ist aber nicht berechtigt. Diese Nachricht wurde auch an deine anderen Vize gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. nhizufügen/entfernen! \nGeh in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-cr ${clannameS} clanrat @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} und ${rat} sein, um einen Clanrat von ${clan} hinzuzufügen/zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** als Clanrat hinzufügen/entfernen bzw. sich darum kümmern!`);
    }
  }
}
