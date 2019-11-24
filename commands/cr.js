exports.run = async (client, message, args, Discord, config, errChannel) => {
  //Eingegebene Nachricht löschen?
  if (config.deleteCR == `y`) message.delete(config.deleteTime * 1000);
  //commando: -cr feste add @Smoker
  var rollen = ``;
  var clans = [`feste`, `spitze`, `wächter`, `löwen`, `see`, `hütte`, `camp`, `steiger`, `lager`];
  var aktion = [`neu`, `alt`, `kick`, `rat`, `clanrat`];
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
  //++++++++++++++++++++++++++++++++++++++++++//
  //--arg "feste" prüfen
  if (!args[0]) return fehler(
    `Kein Clan erkannt!`,
    `Du hast den Clan, hinter -spiel nicht eingegeben! \nz.b. -cr **feste** neu ${message.author}`
  )
    var clanname = args[0].toLowerCase();

  if (!clans.some(r => clans.includes(clanname))) return fehler(
    `Clan ${args[0]} existiert nicht!`,
    `Mögliche Clans sind: \nfeste, spitze, wächter, löwen, see, hütte, camp, steiger, lager`
  )

  //--arg "add" prüfen
  if (!args[1]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -cr feste **neu** ${message.author}`
  )
  var aktionname = args[1].toLowerCase();
  if (!aktion.some(r => aktion.includes(aktionname))) return fehler(
    `Falsche Aktion eingegeben!`,
    `Mögliche Aktionen sind: \n${aktion}`
  )
  if (aktionname === `rat` && clanname === `lager`) return warnung(
    `Falschen Clan eingegeben!`,
    `Das Berglager hat keinen Ältestenrat!`
  )
  if (aktionname === `clanrat` && clanname === `lager`) return warnung(
    `Falschen Clan eingegeben!`,
    `Das Berglager hat keinen Clanrat!`
  )

  //--arg "member" prüfen
  if (!member) return fehler(
    `Keinen Spieler markiert!`,
    `z.b. -cr feste neu ${message.author}`
  )

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//
  //--Entsprechende Clanrolle suchen
  if (clanname === `feste`) {
    var clan = message.guild.roles.get(`376669721996689410`);
    var rat = message.guild.roles.get(`375764361966256138`);
    var chef = message.guild.members.get(`376009624350097408`);
  }
  if (clanname === `spitze`) {
    var clan = message.guild.roles.get(`395277370459815936`);
    var rat = message.guild.roles.get(`395278219231756288`);
    var chef = message.guild.members.get(`367307782187384833`);
  }
  if (clanname === `wächter`) {
    var clan = message.guild.roles.get(`497013915956412422`);
    var rat = message.guild.roles.get(`497013529434652673`);
    var chef = message.guild.members.get(`431169142540861441`);
  }
  if (clanname === `löwen`) {
    var clan = message.guild.roles.get(`522854736555409408`);
    var rat = message.guild.roles.get(`522866717408493590`);
    var chef = message.guild.members.get(`352314546536579072`);
  }
  if (clanname === `see`) {
    var clan = message.guild.roles.get(`508059287575068714`);
    var rat = message.guild.roles.get(`508082121987063843`);
    var chef = message.guild.members.get(`433674128529162250`);
  }
  if (clanname === `hütte`) {
    var clan = message.guild.roles.get(`508059139491102720`);
    var rat = message.guild.roles.get(`508082002663309324`);
    var chef = message.guild.members.get(`579400471035248669`);
  }
  if (clanname === `camp`) {
    var clan = message.guild.roles.get(`636541309561208853`);
    var rat = message.guild.roles.get(`636541823514312723`);
    var chef = message.guild.members.get(`390165799790182400`);
  }
  if (clanname === `steiger`) {
    var clan = message.guild.roles.get(`605458928272408593`);
    var rat = message.guild.roles.get(`605458932588085273`);
    var chef = message.guild.members.get(`375766871699488778`);
  }
  if (clanname === `lager`) {
    var clan = message.guild.roles.get(`536429956545249302`);
    var chef = message.guild.members.get(`375732191625478164`);
  }

  //--Alle anderen CR-Rollen suchen
  let fam = message.guild.roles.get(`636541297473224725`);
  let game = message.guild.roles.get(`625337054670356490`);
  let kammer = message.guild.roles.get(`500429304006574081`);
  let turnier = message.guild.roles.get(`573951535642574848`);
  let pn = message.guild.roles.get(`500429154190360586`);
  let freunde = message.guild.roles.get(`501405795548659712`);
  let altenrat = message.guild.roles.get(`507632542724128789`);
  let clanrat = message.guild.roles.get(`504709824630751232`);

  //++++++++++++++ROLLEN VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//
  //--Rollen hinzufügen
  if (aktionname === `neu`) {
    //Clanrolle vergeben, wenn nicht vorhanden!
    if (member.roles.has(clan.id)) {
      return warnung(`Es wurde nichts geändert!`,
        `**${member.displayName}** hat die Rolle ${clan} bereits!`)
    }
    else {
      member.addRole(clan.id)
        .then(rollen = rollen + `${clan} `)
        .catch(console.error);
    }
    //Familienrolle vergeben, wenn nicht vorhanden!
    if (member.roles.has(fam.id)) {
      fertig(`Rolle hinzugefügt!`,
        `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen! \nSpieler wurde per PN benachrichtigt! \nBitte nicht vergessen den **Nickname anzupassen!**`)
      privat(`Rolle wurde hinzugefügt!`, `599526611787710484.png`, `Wilkommen im Clan Berg${clanname}! Da du ja bereits in der **${fam.name} warst, muss ich ja nicht viel erklären und wünsche dir viel Spass und Erfolg! \Dein Leader ist ${chef}`)
      return logging(`**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`)
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
    fertig(`Rollen hinzugefügt!`, `**${member.displayName}** folgende Rollen hinzugefügt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`)
    privat(`Willkommen bei der Bergclan Familie!`, `599526611787710484.png`,
      `Der Clan Berg${clanname} hat dich aufgenommen. Die für dich relevanten Serverbereiche wurden freigeschaltet: 

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

Melde dich, wenn du einer anderen Gaming Sparte beitreten möchtest, damit wir dir weitere Serverbereiche freischalten können. Wir sind auch in Clash of Clans, Brawl Stars und Call of Duty vertreten. (Du erreichst deinen Leader hier: ${chef})

Viel Spaß beim umsehen, bei Fragen einfach melden, bis bald :wink:`
    )
    return logging(`**${member.displayName}** wurden folgende Rollen hinzugefügt: \n${rollen}`)
  }

  //--Rollen entfernen
  if (aktionname === `alt`) {
    //Clanrolle entfernen, wenn vorhanden!
    if (!member.roles.has(clan.id)) {
      return warnung(`Es wurde nichts geändert!`,
        `**${member.displayName}** hat die Rolle ${clan} nicht!`)
    }
    else {
      member.removeRole(clan.id)
        .then(rollen = rollen + `${clan} `)
        .catch(console.error);
      fertig(`Rolle entfernt!`,
        `**${member.displayName}** wurde die Rolle ${rollen} wurde entfernt! \nBitte nicht vergessen den Nickname anzupassen!`)

      return logging(`**${member.displayName}** wurde die Rolle ${rollen} entfernt!`)
    }
  }

  //--Rollen Clan-Kick
  if (aktionname === `kick`) {
    //Clanrolle entfernen, wenn vorhanden!
    if (!member.roles.has(clan.id)) {
      return warnung(`Es wurde nichts geändert!`,
        `**${member.displayName}** hat die Rolle ${clan} nicht!`)
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
    fertig(`Rollen entfernt!`, `**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`)
    privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wurdest auf **${freunde.name}** zurückgestetzt. Wenn du wieder einem unserer Clans beitreten möchtest, nimm Kontakt zu ${chef} auf damit du die entsprechenden Rechte erhältst!`)
    return logging(`**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen}`)
  }

  //--Rollen Ältestenrat entfernen/hinzufügen
  if (aktionname === `rat`) {
    //Clanrolle entfernen, wenn vorhanden!
    if (!member.roles.has(altenrat.id)) {
      member.addRoles(altenrat.id, rat.id) 
      .then(rollen = rollen + `${altenrat} `)
      .catch(console.error);
      fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt im ${altenrat}!`)
      privat(`Willkommen im Berg${clan} Ältestenrat!`, `599526611787710484.png`, `Deine Aufgabe besteht darin, deinen Clan am laufen zu halten, inaktive Spieler auszusortieren (der Clanleitung melden), aktiv an der Clangestaltung mitzuwirken und den Clanchat zu beleben! Ein bisschen wie ein Animateur, aber eher einfach ein gutes Vorbild :wink:

Wenn dir jemand auffällt, der Urlaub in den Clanchat geschrieben hat, evtl. aber nicht auf Discord ist, trage dies bitte [hier](https://discordapp.com/channels/375761445184471050/393909321169108993) ein.

Am [schwarzen Brett](https://discordapp.com/channels/375761445184471050/646274646097920021) findest du wichtige Infos, die du deinem Clan im Chat mitteilen solltest!! (Falls noch nicht geschehen, oder untergegangen) 

Neuankömmlinge im Clan werden begrüßt, begleitet und evtl. zu Discord "geführt" um das ganze Clangeschehen mitzubekommen! 

Ein <#375762362789265408> ist genau der richtige Ort, an dem sich Clash Royale Älteste austauschen können. So könnt ihr euch über Probleme und Schwachstellen in euren Clans austauschen und sehen was du evtl. besser machen kannst. Alle "Chef-Ältesten" erreichst du mit @👑 Clanrat CR.

Im <#380061588201406465> könnt ihr ungestört miteinander sprechen :wink:`)
      return logging(`**${member.displayName}** ist jetzt ${rat} und im ${altenrat}!`)
    }
    
    if (!member.roles.has(rat.id)) {
      member.addRole(rat.id)
      .then(rollen = rollen + `${rat} `)
      .catch(console.error);
      fertig(`Rolle hinzugefügt!` `**${member.displayName}** wurde die Rolle ${rat} zugewiesen! Da die Rolle ${altenrat} bereits vorhanden war, wurde nur eine PN zur Aufnnahme gesendet! Kein Einleitungstext!`)
      privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest befördert und bist nun **${rat.name}**! Schau dir den Regierungsberich unterhalb des CR-Bereich an, die variieren bei den Clans!`)
      return logging(`**${member.displayName}** wurde die Rolle ${rat} zugewiesen!`)
    }
  

    if (member.roles.has(rat.id)) {
      member.removeRole(rat.id)
      fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle  ${rat} abgenommen!`)
      ptivat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest degradiert und bist nun kein **${rat.name}** mehr! Bei Fragen wende dich an ${chef}!`
      )

      return logging(`**${member.displayName}** wurde die Rolle ${rat} abgenommen!`)
    }    
  }
  //--Rollen Clanrat entfernen/hinzufügen
  if (aktionname === `clanrat`) {
    //Clanrolle entfernen, wenn vorhanden!
    if (!member.roles.has(clanrat.id)) {
      member.addRole(clanrat.id)
      fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt ${clanrat}!`)
      privat(`Willkommen im 👑Clanrat`, `599526611787710484.png`, `Der Clanrat besteht aus Leader und einem Vize, aus jedem Clan! Ihr seid die **Chef-Ältesten**, achtet auf die anderen Ältesten und handelt übergeordnet! Hier wird über Verbundbeitritte oder Clan Neugründungen diskutiert und entschieden!

Erfülle deine bisherigen Aufgaben weiter so gut wie bisher und tausche dich mit deinen und anderen Ältesten aus! Du bist jetzt das **Bindeglied** zwischen deinem **Clan** und der **Clanfamilie!**

Falls du **personelle oder technische** Probleme im Clan hast (Membermangel, Fusionspartner, Änderungen/Wünsche zu Discord, etc.), melde dich im <#504709207753228288> , hier kümmern wir uns um Clan übergreifende Dinge wie **Personal/Technik/Forum.** Nur der Clanrat kann in diesen Chat! Uns alle erreicht man mit @👑 Clanrat CR.

Im <#506914804280328192> könnt ihr ungestört miteinander sprechen falls nötig. :wink:`)
      return logging(`**${member.displayName}** wurde die Rolle ${clanrat} zugewiesen!`)
    }
    if (member.roles.has(clanrat.id)) {
      member.removeRole(clanrat.id)
      fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle ${clanrat} abgenommen!`)
      privat(`Hallo ${member.displayName}`, `599526611787710484.png`, `Du wudest degradiert und bist nun kein **${clanrat.name}** mehr! Bei Fragen wende dich an ${chef}!`)
      return logging(`**${member.displayName}** wurde die Rolle ${clanrat} abgenommen!`)
    }    
  }
}