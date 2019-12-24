exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {

  //Eingegebene Nachricht löschen?
  if (config.deleteCW == `y`) message.delete(config.deleteTime * 1000);

  //Erstes Wort nach Kommando als befehl definieren
  const befehl = args[0];

  // Wenn befehl nicht vorhanden STOP => Nachricht senden
  if (!befehl) return fehler(`Kein Tag!`, `Es muss ein Tag (#9LRG029U) eingegeben werden!`);

  // Wenn befehl nicht mit # beginnt STOP => Nachricht senden
  if (!befehl.startsWith(`#`)) return fehler(`Tag falsch eingegeben!`, `Usertag muss so eingegenen werden #9LRG029U`);

  // befehl am # teilen und als tag definieren
  const tag = befehl.split(`#`)[1].toUpperCase();

  //**********************************************//
  // API Request ---Spielerabfrage--- ***dataA***
  const request = require(`request`);
  var optionsa = {
    method: `GET`,
    url: `${config.APIurl}/player/${tag}`,
    json: true,
    headers: { auth: process.env.API_SECRET }
  };
  request(optionsa, function(errA, resA, dataA) {
    if (errA) throw new Error(errA);
    // Error Behandlung ist STOP => Nachricht senden
    if (resA.statusCode === 200) console.log(dataA.name + ` erfolgreich abgefragt.`)
    if (resA.statusCode === 400) return fehler(`Falsches Tag!`, `Dein eingegebenes Spielertag (#9LRG029U) ist falsch! Kopiere es am besten aus dem Spielerprofil!`);
    if (resA.statusCode === 401) return fehler(`Royale-API Token!`, `Etwas mit dem Api-Token stimmt nicht. Bitte melde es <@404331123900940298>!`);
    if (resA.statusCode === 403) return fehler(`Verboten!`, `Zugang zu verbotenem Bereich, etwas ist schief gelaufen. Bitte melde es <@404331123900940298>!`);
    if (resA.statusCode === 417) return fehler(`Royale-API...`, `Versuch es später nochmal!`);
    if (resA.statusCode === 429) return fehler(`Royale-API überlastet!`, `Zu viele Api-Abfragen... Bitte warte ein wenig!`);
    if (resA.statusCode === 500 || resA.statusCode === 501 || resA.statusCode === 503 || resA.statusCode === 522) return fehler(`Royale-API...`, `Versuch es später nochmal!`);

    //Emojis definieren
    const cwx = client.emojis.get(`574839788385992704`);
    const cwloss = client.emojis.get(`574655777760083990`);
    const cwwin = client.emojis.get(`574655806663032862`);
    const trophys = client.emojis.get(`609806255493742651`);
    const trophysPB = client.emojis.get(`609806379242356817`);
    const maxi = client.emojis.get(`658258500937580585`);
    const legi = client.emojis.get(`609804490584883210`);
    const gold = client.emojis.get(`609804716758794262`);
    const silber = client.emojis.get(`609804751479242753`);
    const bronze = client.emojis.get(`609804786921111557`);
    const battle = client.emojis.get(`609806421063761920`);
    const cardlvl = client.emojis.get(`610434858157867008`);
    const cwwins = client.emojis.get(`610052821102100480`);
    const cwtrophy = client.emojis.get(`610057019176648724`);

    //Berechnen der Kartenlvl
    var bro = sil = gol = leg = max = 0;

    for (const key in dataA.cards) {
      cardlevel = dataA.cards[key].displayLevel;
      if (cardlevel == 9) bro = bro + 1;
      if (cardlevel == 10) sil = sil + 1;
      if (cardlevel == 11) gol = gol + 1;
      if (cardlevel == 12) leg = leg + 1;
      if (cardlevel == 13) max = max + 1;
      var per_bro = ((bro + sil + gol + leg + max) / config.kartenanzahl) * 100;
      var per_sil = ((sil + gol + leg + max) / config.kartenanzahl) * 100;
      var per_gol = ((gol + leg + max) / config.kartenanzahl) * 100;
      var per_leg = ((leg + max) / config.kartenanzahl) * 100;
      var per_max = (max / config.kartenanzahl) * 100;
    }

    if (dataA.clan.name != "") {

      //API Request ---Clanabfrage Warlog--- ***data***
      var options = {
        method: `GET`,
        url: `${config.APIurl}/clan/${dataA.clan.tag}/warlog`,
        json: true,
        headers: { auth: process.env.API_SECRET }
      };
      request(options, function(err, res, data) {
        if (err) throw new Error(err);
        // Error Behandlung ist STOP => Nachricht senden
        if (res.statusCode === 200) console.log(dataA.name + ` erfolgreich abgefragt.`)
        if (res.statusCode === 400) return fehler(`Falsches Tag!`, `Dein eingegebenes Spielertag (#9LRG029U) ist falsch! Kopiere es am besten aus dem Spielerprofil!`);
        if (res.statusCode === 401) return fehler(`Royale-API Token!`, `Etwas mit dem Api-Token stimmt nicht. Bitte melde es <@404331123900940298>!`);
        if (res.statusCode === 403) return fehler(`Verboten!`, `Zugang zu verbotenem Bereich, etwas ist schief gelaufen. Bitte melde es <@404331123900940298>!`);
        if (res.statusCode === 417) return fehler(`Royale-API...`, `Versuch es später nochmal!`);
        if (res.statusCode === 429) return fehler(`Royale-API überlastet!`, `Zu viele Api-Abfragen... Bitte warte ein wenig!`);
        if (res.statusCode === 500 || res.statusCode === 501 || res.statusCode === 503 || resA.statusCode === 522) return fehler(`Royale-API...`, `Versuch es später nochmal!`);
        //--------------------------------------------------------------------------------------------------
        //API Request ---Clanabfrage Clan--- ***dataB***
        var optionsb = {
          method: `GET`,
          url: `${config.APIurl}/clan/${dataA.clan.tag}`,
          json: true,
          headers: { auth: process.env.API_SECRET }
        };
        request(optionsb, function(errB, resB, dataB) {
          if (errB) throw new Error(errB);
          // Error Behandlung ist STOP => Nachricht senden
          if (resB.statusCode === 200) console.log(dataA.name + ` erfolgreich abgefragt.`)
          if (resB.statusCode === 400) return fehler(`Falsches Tag!`, `Dein eingegebenes Spielertag (#9LRG029U) ist falsch! Kopiere es am besten aus dem Spielerprofil!`);
          if (resB.statusCode === 401) return fehler(`Royale-API Token!`, `Etwas mit dem Api-Token stimmt nicht. Bitte melde es <@404331123900940298>!`);
          if (resB.statusCode === 403) return fehler(`Verboten!`, `Zugang zu verbotenem Bereich, etwas ist schief gelaufen. Bitte melde es <@404331123900940298>!`);
          if (resB.statusCode === 417) return fehler(`Royale-API...`, `Versuch es später nochmal!`);
          if (resB.statusCode === 429) return fehler(`Royale-API überlastet!`, `Zu viele Api-Abfragen... Bitte warte ein wenig!`);
          if (resB.statusCode === 500 || resB.statusCode === 501 || resB.statusCode === 503 || resA.statusCode === 522) return fehler(`Royale-API...`, `Versuch es später nochmal!`);

          //quote und Verwarnungen berechnen
          var quote = teiln = sammelwarn = kriegwarn = spiele = siege = mogliche = 0;
          var pics = `|`;
          //Auslesen der teilnehmer
          for (const key in data) {
            teilnehmer = data[key].participants;
            //Auslesen der Tags
            for (const anz in teilnehmer) {
              member = teilnehmer[anz].tag;

              //Wenn Tag mit abgefagtem übereinstimmt
              if (member == tag) {

                //teilnahme und quote berechnen
                wins = teilnehmer[anz].wins;
                spiele = spiele + teilnehmer[anz].battleCount;
                siege = siege + wins;
                quote = (siege / spiele) * 100;
                if (teilnehmer[anz].battleCount > 1) mogliche = mogliche + 1;
                teiln = (spiele / (mogliche + 10)) * 100;

                //Zuordnung der CW Emoji
                if (teilnehmer[anz].battlesPlayed == 0 && teilnehmer[anz].battleCount == 1) pics = pics + cwx;
                if (teilnehmer[anz].battlesPlayed == 0 && teilnehmer[anz].battleCount == 2) pics = pics + cwx + cwx;
                if (wins == 0 && teilnehmer[anz].battlesPlayed == 1 && teilnehmer[anz].battleCount == 1) pics = pics + cwloss;
                if (wins == 1 && teilnehmer[anz].battlesPlayed == 1 && teilnehmer[anz].battleCount == 1) pics = pics + cwwin;
                if (wins == 0 && teilnehmer[anz].battlesPlayed == 1 && teilnehmer[anz].battleCount == 2) pics = pics + cwx + cwloss;
                if (wins == 1 && teilnehmer[anz].battlesPlayed == 1 && teilnehmer[anz].battleCount == 2) pics = pics + cwx + cwwin;
                if (wins == 0 && teilnehmer[anz].battlesPlayed == 2) pics = pics + cwloss + cwloss;
                if (wins == 1 && teilnehmer[anz].battlesPlayed == 2) pics = pics + cwwin + cwloss;
                if (wins == 2 && teilnehmer[anz].battlesPlayed == 2) pics = pics + cwwin + cwwin;

                //Berechnung der Verwarnungen von CW
                if (teilnehmer[anz].collectionDayBattlesPlayed < 3) sammelwarn = sammelwarn + 1;
                if (teilnehmer[anz].battlesPlayed == 0) kriegwarn = kriegwarn + 1;
              }
            } pics = pics + ` | `;
          }

          //Zuordnung des CLAN Liga Emoji
          if (dataB.warTrophies >= 3000) var emoLiga = legi;
          if (dataB.warTrophies <= 2999 && dataB.warTrophies >= 1500) var emoLiga = gold;
          if (dataB.warTrophies <= 1499 && dataB.warTrophies >= 600) var emoLiga = silber;
          if (dataB.warTrophies <= 599) var emoLiga = bronze;

          //Zuordnung des KÖNIG Laune Emoji
          if (sammelwarn == 0 && kriegwarn == 0) var face = `http://www.oyunincele.me/clash/emotions/thumbs-up.gif`;
          if (sammelwarn >= 1 || kriegwarn >= 1) var face = `http://www.oyunincele.me/clash/emotions/angrer.gif`;

          //Nachricht senden wenn in einem Clan
          const embedINFO = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setAuthor(
              `${dataA.name} | #${tag}`,
              `http://www.oyunincele.me/clash/levels/${dataA.stats.level}.png`,
              `https://royaleapi.com/player/${tag}`)
            .setTitle(
              cardlvl + "Kartenlvl. / Trophäen: " + trophys + "`" + dataA.trophies + "` " + trophysPB + "`" + dataA.stats.maxTrophies + "`"
            )
            .setDescription(
              maxi + "`" + per_max.toFixed(0) + "% `" + legi + "`" + per_leg.toFixed(0) + "% `" + gold + "`" + per_gol.toFixed(0) + "%`" +
              silber + "`" + per_sil.toFixed(0) + "% `" + bronze + "`" + per_bro.toFixed(0) + "%` " +
              cwwins + "Wins `" + dataA.games.warDayWins + "`"
            )
            .addField(
              dataA.clan.name + emoLiga + cwtrophy + "`" + dataB.warTrophies + "`",
              pics + "\n" +
              battle + "Teiln:`" + teiln.toFixed(0) + "%` Wins:`" + quote.toFixed(0) + "%`      " +
              "     :outbox_tray: `" + dataA.clan.donations + "`" + " :inbox_tray: `" + dataA.clan.donationsReceived + "`"
            )
            .setFooter(
              `${dataA.name}'s verpasste Sammelspiele: ${sammelwarn} Kriegsspiele: ${kriegwarn}`, face
            )
          message.channel.send(embedINFO).catch(console.error);
        });
      });
    }

    else {
      const embedINFO = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setAuthor(
          `${dataA.name} | #${tag}`,
          `http://www.oyunincele.me/clash/levels/${dataA.stats.level}.png`,
          `https://royaleapi.com/player/${tag}`)
        .setTitle(
          cardlvl + "Kartenlvl. / Trophäen: " + trophys + "`" + dataA.trophies + "` " + trophysPB + "`" + dataA.stats.maxTrophies + "`"
        )
        .setDescription(
          legi + "`" + per_leg.toFixed(0) + "% `" + gold + "`" + per_gol.toFixed(0) + "%`" +
          silber + "`" + per_sil.toFixed(0) + "% `" + bronze + "`" + per_bro.toFixed(0) + "%` " +
          cwwins + "Wins `" + dataA.games.warDayWins + "`"
        )
        .setFooter(
          `Clankriege und alle Infos dazu, können nur für Spieler in Clans angezeigt werden!`, `http://www.oyunincele.me/clash/emotions/cry.gif`
        )
      message.channel.send(embedINFO).catch(console.error);
      return console.log(`CW Prüfung für ${dataA.name} erfolgreich durchgeführt!`);
    }
  });
}
