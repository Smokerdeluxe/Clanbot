exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {

  //commando: -cr feste add @Smoker
  //Eingegebene Nachricht löschen?
  if (config.deleteRoleManager == `y`) message.delete(config.deleteTime * 1000);
  
  //++++++++++++++EINGABE PRÜFEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  //--arg "feste" prüfen
  if (!args[0]) return fehler(
    `Kein Clan erkannt!`,
    `Du hast den Clan, hinter -spiel nicht eingegeben! \nz.b. -coc **feste** neu ${message.author}`
  );
  let clanname = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
  let clannameS = args[0].toLowerCase();
  let clans = config.clanCoC.map(c => c.clan);
  let clanmogl = clans.join(", ");
  if (!clans.includes(clanname)) return fehler(
    `Clan ${args[0]} existiert nicht!`,
    `Mögliche Clans sind: \n${clanmogl}`
  );

  //--arg "add" prüfen
  if (!args[1]) return fehler(
    `Keine Aktion eingegeben!`,
    `z.b. -coc feste **neu** ${message.author}`
  );
  let aktion = [`neu`, `alt`, `kick`, `rat`, `clanrat`];
  let aktionname = args[1].toLowerCase();
  if (!aktion.includes(aktionname)) return fehler(
    `Falsche Aktion eingegeben!`,
    `Mögliche Aktionen sind: \n${aktion}`
  );

  //--arg "member" prüfen
  let member = message.mentions.members.first();
  let user = message.mentions.users.first();
  if (!member) return fehler(
    `Keinen Spieler markiert!`,
    `z.b. -coc feste neu ${message.author}`
  );

  //++++++++++++++PASSENDE ROLLEN SUCHEN++++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++++++++++//-----------------------------------------------------------
  //--Alle CR-Rollen suchen
  let fam = message.guild.roles.get(config.famCoC);
  let game = message.guild.roles.get(config.gameCoC);
  let freunde = message.guild.roles.get(config.freunde);
  
  let altenrat = message.guild.roles.get(config.altenrat);
  let clanrat = message.guild.roles.get(config.clanrat);
  let baumeista = message.guild.roles.get(config.baumeista);

  //--Entsprechende Clanrolle suchen
  for (const nr in clans) {
    if (clanname === clans[nr]) {
      var clan = message.guild.roles.find(r => r.name === config.clanbezCoC + clannameS);
      var rat = message.guild.roles.find(r => r.name === config.altCoC + clanname);
      var clanratClan = message.guild.roles.find(r => r.name === config.ratCoC + clanname);
      var leitung = rat.members.filter(m => m.roles.has(clanratClan.id)).map(u => u.user.id);
      var fuhrung = rat.members.filter(m => m.roles.has(clanratClan.id)).map(u => u.nickname).join("\n");
      var fuhrungPing = rat.members.filter(m => m.roles.has(clanratClan.id)).map(u => `${u.user}`).join("\n");
    }
  }
  //++++++++++++++ROLLEN VERGEBEN+++++++++++++//
  //++++++++++++++++++++++++++++++++++++++++++//-------------------------------------------------------------------
  var rollen = ``;
  //--Rollen hinzufügen
  if (aktionname === `neu`) {
    
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanrat.id)){
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
        privat(`Rolle wurde hinzugefügt!`, config.emojiCoC, `Wilkommen im Clan **${clan.name}**! Da du ja bereits in der **${fam.name}** warst, muss ich ja nicht viel erklären und wünsche dir viel Spass und Erfolg! \n\n`, `__Deine Clanführung:__`, `${fuhrungPing}`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde die Rolle ${rollen} hinzugefügt!`);
      }
      else {
        member.addRole(fam.id)
          .then(rollen = rollen + `${fam} `)
          .catch(console.error);
      }
      //Zusatzrollen vergeben, wenn nicht vorhanden, Freunde entfernen!
      if (!member.roles.has(game.id)) member.addRole(game.id)
        .then(rollen = rollen + `${game} `)
        .catch(console.error);
      if (member.roles.has(freunde.id)) member.removeRole(freunde.id)
        .then(rollen = rollen + `Die Rolle ${freunde} wurde entfernt!`)
        .catch(console.error);
      fertig(`Rollen hinzugefügt!`, `**${member.displayName}** folgende Rollen hinzugefügt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Willkommen bei der Bergclan Familie!`, config.emojiCoC,
        `Der Clan **${clan.name}** hat dich aufgenommen. Die für dich relevanten Serverbereiche wurden freigeschaltet: 

**__Innenhof__**
Du hast nun Zutritt zum [Wegweiser](${config.chanLink}/${message.guild.id}/500419980022513665/637422022867288074) dort kannst du verschiedene Bereiche ab- bzw. anschalten. Bitte genau lesen!

Das :sos: ist z.B. der **Support-Bereich**, dort findest du Infos zum Server und zu Discord überhaupt! Für Discord Neulinge sehr zu empfehlen, auch für den ersten Einstig! (muss leider angeschalten werden!)

**__Schänke__**
Hier kommunizieren wir **ALLE** zusammen (Familie, Freunde und Gäste)! Du bist herzlich eingeladen im [Berg-Chat](${config.chanLink}/${message.guild.id}/375762081632485376) dabei zu sein!

**__⚔ Clash of Clans ⚔__**
Hier ist die CoC Community vereint. Der Bereich bietet einen [Chat](${config.chanLink}/${message.guild.id}/640774007985274900), [Freundeslink Kanal](${config.chanLink}/${message.guild.id}/651631584218316810), u.v.m...

Frag da gerne alles was du möchtest. Egal was für Fragen du hast!

Nähere Infos zu einem Kanal (Zweck, wer schreibt hier usw.) findest du in der Kanalbeschreibung (vom rechten Rand nach links wischen, Textfeld ganz oben)

Melde dich, wenn du einer anderen Gaming Sparte beitreten möchtest, damit wir dir weitere Serverbereiche freischalten können. Wir sind auch in Clash Royale und Brawl Stars vertreten. 

Viel Spaß beim umsehen, bei Fragen einfach melden, bis bald :wink:`, `__Deine Clanführung:__`, `${fuhrungPing}`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurden folgende Rollen hinzugefügt: \n${rollen}`);
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** einzuteilen, ist aber nicht berechtigt. Diese Nachricht wurde an **${clanratClan.name}** gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. einteilen! \nFür Spieler aus einem Familienclan gehe dazu in <#375762081632485376>, für neue Spieler gehe dazu in <#500399456861028352> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-coc ${clannameS} neu @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanrat} sein, um Leute für unseren Server einzuteilen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** einteilen!`);
    }
  }

  //--Rollen entfernen---------------------------------------------------------------------------------------------
  if (aktionname === `alt`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanratClan.id)){
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
      if (member.roles.has(rat.id)) member.removeRole(rat.id)
        .then(rollen = rollen + `${rat} `)
        .catch(console.error);
      if (member.roles.has(clanratClan.id)) member.removeRole(clanratClan.id)
        .then(rollen = rollen + `${clanratClan} `)
        .catch(console.error);
      fertig(`Rolle entfernt!`,
        `**${member.displayName}** wurde die Rolle ${rollen} wurde entfernt! \nBitte nicht vergessen den **Nickname anzupassen!**`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde die Rolle ${rollen} entfernt!`);
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** zu entfernen, ist aber nicht berechtigt. Diese Nachricht wurde an **${clanratClan.name}** gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. entfernen! \nGehe dazu in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-coc ${clannameS} alt @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratClan} sein, um Leute von ${clan} zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** entfernen bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Clan-Kick---------------------------------------------------------------------------------------------
  if (aktionname === `kick`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanratClan.id)) {
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
      //Alle anderen Rollen entferne, wenn vorhanden, Freunde hinzufügen
      if (member.roles.has(fam.id)) member.removeRole(fam.id)
        .then(rollen = rollen + `${fam} `)
        .catch(console.error);
      if (member.roles.has(game.id)) member.removeRole(game.id)
        .then(rollen = rollen + `${game} `)
        .catch(console.error);
      if (member.roles.has(rat.id)) member.removeRole(rat.id)
        .then(rollen = rollen + `${rat} `)
        .catch(console.error);
      if (member.roles.has(altenrat.id)) member.removeRole(altenrat.id)
        .then(rollen = rollen + `${altenrat} `)
        .catch(console.error);
      if (member.roles.has(clanratClan.id)) member.removeRole(clanratClan.id)
        .then(rollen = rollen + `${clanratClan} `)
        .catch(console.error);
      if (member.roles.has(clanrat.id)) member.removeRole(clanrat.id)
        .then(rollen = rollen + `${clanrat} `)
        .catch(console.error);
      if (!member.roles.has(freunde.id)) member.addRole(freunde.id)
        .then(rollen = rollen + `Die Rolle ${freunde} wurde zugewiesen!`)
        .catch(console.error);
      fertig(`Rollen entfernt!`, `**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen} \nBitte nicht vergessen den **Nickname anzupassen!**`);
      privat(`Hallo ${member.displayName}`, config.emojiCoC, `Du wurdest auf **${freunde.name}** zurückgestetzt. Wenn du wieder einem unserer Clans beitreten möchtest, nimm Kontakt zu uns auf:\n\n`, `__Deine Clanführung:__`, `${fuhrungPing}`);
      return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurden folgende Rollen entfernt: \n${rollen}`);
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als Mitglied für **${clan.name}** zu entfernen und aus der **${fam.name}** zu kicken, ist aber nicht berechtigt. Diese Nachricht wurde an **${clanratClan.name}** gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. kicken! \nGeh in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-coc ${clannameS} kick @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratClan} sein, um Leute von ${clan} zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** kicken bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Ältestenrat entfernen/hinzufügen----------------------------------------------------------------------
  if (aktionname === `rat`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(clanratClan.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(altenrat.id)) {
        member.addRole(altenrat.id)
          .then(rollen = rollen + `${altenrat} `)
          .catch(console.error);
        member.addRole(rat.id)
          .then(rollen = rollen + `und ${rat}`)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt im ${rollen}! Der Einleitungstext zur Aufgabenbeschreibung wurde per PN gesendet!`);
        privat(`Willkommen im ${altenrat.name}!`, config.emojiCoC, `Deine Aufgabe besteht darin, deinen Clan am laufen zu halten, inaktive Spieler auszusortieren (der Clanleitung melden), aktiv an der Clangestaltung mitzuwirken und den Clanchat zu beleben! Ein bisschen wie ein Animateur, aber eher einfach ein gutes Vorbild :wink:

Wenn dir jemand auffällt, der Urlaub in den Clanchat geschrieben hat, evtl. aber nicht auf Discord ist, trage dies bitte [hier](${config.chanLink}/${message.guild.id}/393909321169108993) ein.

Am [schwarzen Brett](${config.chanLink}/${message.guild.id}/470261834985897996) findest du wichtige Infos, die du deinem Clan im Chat mitteilen solltest (Falls noch nicht geschehen, oder untergegangen)! 

Neuankömmlinge im Clan werden begrüßt, begleitet und evtl. zu Discord "geführt" um das ganze Clangeschehen mitzubekommen! 

Ein <#375762362789265408> ist genau der richtige Ort, an dem sich alle Ältesten austauschen können. So könnt ihr euch über Probleme und Schwachstellen in euren Clans austauschen und sehen was du evtl. besser machen kannst. Alle "Chef-Ältesten" erreichst du mit @${clanratCoC.name}.

Im <#380061588201406465> könnt ihr ungestört miteinander sprechen :wink:`, `\u200b`, `\u200b`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde/n die Rolle/n ${rollen} zugewiesen!`);
      }
      if (!member.roles.has(rat.id)) {
        member.addRole(rat.id)
          .then(rollen = rollen + `${rat} `)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen! Da die Rolle ${altenrat} bereits vorhanden war, wurde nur eine PN zur Aufnnahme gesendet! Kein Einleitungstext!`);
        privat(`Hallo ${member.displayName}`, config.emojiCoC, `Du wudest befördert und bist nun **${rat.name}**! Schau dir den Regierungsberich unterhalb des CoC-Bereich an, er variiert bei den Clans!`, `__Deine Clanführung:__`, `${fuhrungPing}`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde/n die Rolle/n ${rollen} zugewiesen!`);
      }
      if (member.roles.has(rat.id)) {
        member.removeRole(rat.id)
          .then(rollen = rollen + `${rat} `)
          .catch(console.error);
        fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle  ${rollen} abgenommen! Es wurde eine PN zur Info gesendet!`);
        privat(`Hallo ${member.displayName}`, config.emojiCoC, `Du wudest degradiert und bist nun kein **${rat.name}** mehr! Bei Fragen wende dich an:`, `__Deine Clanführung:__`, `${fuhrungPing}`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde die Rolle ${rat} abgenommen!`);
      }
    }
    else {
      for (const key in leitung) {
        userID = leitung[key];
        client.users.get(userID).send(`Huhu... \n**${message.member.nickname}** hat versucht, **${member.displayName}** als **${rat.name}** hinzuzufügen/zu entfernen, ist aber nicht berechtigt. Diese Nachricht wurde an **${clanratClan.name}** gesendet, ihr wisst also alle Bescheid. Bitte schaut euch das mal an, ggf. nhizufügen/entfernen! \nGehe dazu in <#375762081632485376> (Falls hier **#invalid-channel** steht, kurz auf unser Servericon klicken). \nDort fügst du folgende Zeile ein! \n\n:arrow_down: Kopiere :arrow_down:`)
          .then(client.users.get(userID).send(`-coc ${clannameS} rat @${user.username}#${user.discriminator}`))
          .catch(console.error);
      }
      return fehler(`Nicht berechtigt!`, `Du musst im ${clanratClan} sein, um ${rat} hinzuzufügen/zu entfernen! Ich habe eine PN an die Clanführung gesendet: \n\n${fuhrung} \n\nSie werden **${member.displayName}** als Älteste/n hinzufügen/entfernen bzw. sich darum kümmern!`);
    }
  }

  //--Rollen Clanrat entfernen/hinzufügen--------------------------------------------------------------------------
  if (aktionname === `clanrat`) {
    //--Beschränkung auf Clanrat + Ältestenrat CLAN
    if (message.member.roles.has(baumeista.id)) {
      //Clanrolle entfernen, wenn vorhanden!
      if (!member.roles.has(clanrat.id)) {
        member.addRole(clanratClan.id)
          .then(rollen = rollen + `${clanratClan} `)
          .catch(console.error);
        member.addRole(clanrat.id)
          .then(rollen = rollen + `und ${clanrat}`)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** ist jetzt ${rollen}!`);
        privat(`Willkommen im ${clanrat.name}`, config.emojiCoC, `Der Clanrat besteht aus Leader und einem Vize, aus jedem Clan! Ihr seid die **Chef-Ältesten**, achtet auf die anderen Ältesten und handelt übergeordnet! Hier wird über Verbundbeitritte oder Clan Neugründungen diskutiert und entschieden!

Erfülle deine bisherigen Aufgaben weiter so gut wie bisher und tausche dich mit deinen und anderen Ältesten aus! Du bist jetzt das **Bindeglied** zwischen deinem **Clan** und der **Clanfamilie!**

Falls du **personelle oder technische** Probleme im Clan hast (Membermangel, Fusionspartner, Änderungen/Wünsche zu Discord, etc.), melde dich im <#504709207753228288> , hier kümmern wir uns um Clan übergreifende Dinge wie **Personal/Technik/Forum.** Nur der Clanrat kann in diesen Chat! Uns alle erreicht man mit **@${clanrat.name}**.

Im <#506914804280328192> könnt ihr ungestört miteinander sprechen falls nötig. :wink:`, `\u200b`, `\u200b`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen!`);
      }
      if (!member.roles.has(clanratClan.id)) {
        member.addRole(clanratClan.id)
          .then(rollen = rollen + `${clanratClan} `)
          .catch(console.error);
        fertig(`Rolle hinzugefügt!`, `**${member.displayName}** wurde die Rolle ${rollen} zugewiesen! Da die Rolle ${clanrat} bereits vorhanden war, wurde nur eine PN zur Aufnnahme gesendet! Kein Einleitungstext!`);
        privat(`Hallo ${member.displayName}`, config.emojiCoC, `Du wudest befördert und bist nun **${clanratClan.name}**! Da du ja bereits im **${clanrat.name}** bist, muss ich ja nicht viel erklären, viel Spaß!`, `__Deine Clanführung:__`, `${fuhrungPing}`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde/n die Rolle/n ${rollen} zugewiesen!`);
      }
      if (member.roles.has(clanratClan.id)) {
        member.removeRole(clanratClan.id)
          .then(rollen = rollen + `${clanratClan} `)
          .catch(console.error);
        fertig(`Rolle entfernt!`, `**${member.displayName}** wurde die Rolle ${rollen} abgenommen!`);
        privat(`Hallo ${member.displayName}`, config.emojiCoC, `Du wudest degradiert und bist nun kein **${clanrat.name}** mehr! Bei Fragen wende dich an:`, `__Deine Clanführung:__`, `${fuhrungPing}`);
        return logging(message.member.nickname + ` hat Rollen bearbeitet!`, config.emojiRole, `**${member.displayName}** wurde die Rolle ${rollen} abgenommen!`);
      }
    }
    else {
      logging(message.member.nickname + ` wollte Rollen bearbeiten!`, config.emojiRole, `${baumeista}, **${member.displayName}** wurde **NICHT** bearbeitet, da die Berechtigung fehlt!`);
      return fehler(`Nicht berechtigt!`, `Du musst ${baumeista} sein, um einen ${clanratClan} hinzuzufügen/zu entfernen!`);
    }
  }
}
