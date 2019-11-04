exports.run = async (client, message, args) => {

  //Eingegebene Nachricht löschen?
  var config = require(`./config.json`);
  if (config.kommandoDelete == `y`) message.delete();

  //Erstes Wort nach Kommando als Befehl definieren
  const Befehl = args[0];

  // Wenn Befehl nicht vorhanden STOP => Nachricht senden
  if (!Befehl) return message.reply(`\nEs muss ein Tag (#9LRG029U) eingegeben werden!`);

  // Wenn Befehl nicht mit # beginnt STOP => Nachricht senden
  if (!Befehl.startsWith(`#`)) return message.reply(`\nUsertag muss so eingegenen werden #9LRG029U`);

  // Befehl am # teilen und als tag definieren
  const tag = Befehl.split(`#`)[1].toUpperCase();

  // API Request ---Spielerabfrage--- ***dataA***
  const request = require(`request`);
  var optionsa = {
    method: `GET`,
    url: `${config.APIurl}/player/${tag}`,
    headers: { auth: process.env.API_SECRET }
  };
  request(optionsa, function(errora, response, bodya) {
    if (errora) throw new Error(errora);
    // Error Behandlung ist STOP => Nachricht senden
    if (bodya.startsWith(`<`)) return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);
    // Daten als JSON Datei übergeben
    let dataA = JSON.parse(bodya);
    // Error Behandlung ist STOP => Nachricht senden
    if (dataA.status === 400 || dataA.status === 401 || dataA.status === 404)
      return message.reply(`\nFalsches Tag (#9LRG029U) eingegeben!`);
    if (dataA.status === 429 || dataA.statusCode === 500 || dataA.status === 503 || dataA.status === 522)
      return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);

    //Discord.js laden, um Embed zu erstellen
    const Discord = require(`discord.js`);

    //Emojis definieren
    const cwx = client.emojis.get(`574839788385992704`);
    const cwloss = client.emojis.get(`574655777760083990`);
    const cwwin = client.emojis.get(`574655806663032862`);
    const trophys = client.emojis.get(`609806255493742651`);
    const trophysPB = client.emojis.get(`609806379242356817`);
    const legi = client.emojis.get(`609804490584883210`);
    const gold = client.emojis.get(`609804716758794262`);
    const silber = client.emojis.get(`609804751479242753`);
    const bronze = client.emojis.get(`609804786921111557`);
    const battle = client.emojis.get(`609806421063761920`);
    const cardlvl = client.emojis.get(`610434858157867008`);
    const cwwins = client.emojis.get(`610052821102100480`);
    const cwtrophy = client.emojis.get(`610057019176648724`);

    //Berechnen der Kartenlvl
    var bro = sil = gol = leg = 0;

    for (const key in dataA.cards) {
      cardlevel = dataA.cards[key].displayLevel;
      if (cardlevel == 9) bro = bro + 1;
      if (cardlevel == 10) sil = sil + 1;
      if (cardlevel == 11) gol = gol + 1;
      if (cardlevel == 12 || cardlevel == 13) leg = leg + 1;
      var per_bro = ((bro + sil + gol + leg) / config.kartenanzahl) * 100;
      var per_sil = ((sil + gol + leg) / config.kartenanzahl) * 100;
      var per_gol = ((gol + leg) / config.kartenanzahl) * 100;
      var per_leg = (leg / config.kartenanzahl) * 100;
    }

    if (dataA.clan.name != "") {

      //API Request ---Clanabfrage Warlog--- ***data***
      var options = {
        method: `GET`,
        url: `${config.APIurl}/clan/${dataA.clan.tag}/warlog`,
        headers: { auth: process.env.API_SECRET }
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        // Error Behandlung ist STOP => Nachricht senden
        if (body.startsWith(`<`)) return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);
        // Daten als JSON Datei übergeben
        let data = JSON.parse(body);
        // Error Behandlung ist STOP => Nachricht senden
        if (data.status === 400 || data.status === 401 || data.status === 404)
          return message.reply(`\nFalsches Tag (#9LRG029U) eingegeben!`);
        if (data.status === 429 || data.status === 500 || data.status === 503 || data.status === 522)
          return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);
        //--------------------------------------------------------------------------------------------------
        //API Request ---Clanabfrage Clan--- ***dataB***
        var optionsb = {
          method: `GET`,
          url: `${config.APIurl}/clan/${dataA.clan.tag}`,
          headers: { auth: process.env.API_SECRET }
        };
        request(optionsb, function(errorb, response, bodyb) {
          if (errorb) throw new Error(errorb);
          // Error Behandlung ist STOP => Nachricht senden
          if (bodyb.startsWith(`<`)) return message.reply(`\n Probleme mit der RoayleApi, versuch es später`);
          // Daten als JSON Datei übergeben
          let datab = JSON.parse(bodyb);
          // Error Behandlung ist STOP => Nachricht senden
          if (datab.status === 400 || datab.status === 401 || datab.status === 404)
            return message.reply(`\n Falsches Tag (#9LRG029U) eingegeben!`);
          if (datab.status === 429 || datab.status === 500 || datab.status === 503 || datab.status === 522)
            return message.reply(`\n Probleme mit der RoayleApi, versuch es später`);

          //Quote und Verwarnungen berechnen
          var Quote = Teiln = Sammelwarn = Kriegwarn = spiele = siege = mogliche = 0;
          var pics = `|`;

          //Auslesen der Teilnehmer
          for (const key in data) {
            teilnehmer = data[key].participants;
            //Auslesen der Tags
            for (const anz in teilnehmer) {
              member = teilnehmer[anz].tag;

              //Wenn Tag mit abgefagtem übereinstimmt
              if (member == tag) {

                //Teilnahme und Quote berechnen
                wins = teilnehmer[anz].wins;
                spiele = spiele + teilnehmer[anz].battleCount;
                siege = siege + wins;
                Quote = (siege / spiele) * 100;
                if (teilnehmer[anz].battleCount > 1) mogliche = mogliche + 1;
                Teiln = (spiele / (mogliche + 10)) * 100;

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
                if (teilnehmer[anz].collectionDayBattlesPlayed < 3) Sammelwarn = Sammelwarn + 1;
                if (teilnehmer[anz].battlesPlayed == 0) Kriegwarn = Kriegwarn + 1;
              }
            } pics = pics + ` | `;
          }

          //Zuordnung des CLAN Liga Emoji
          if (datab.warTrophies >= 3000) var emoLiga = legi;
          if (datab.warTrophies <= 2999 && datab.warTrophies >= 1500) var emoLiga = gold;
          if (datab.warTrophies <= 1499 && datab.warTrophies >= 600) var emoLiga = silber;
          if (datab.warTrophies <= 599) var emoLiga = bronze;

          //Zuordnung des KÖNIG Laune Emoji
          if (Sammelwarn == 0 && Kriegwarn == 0) var face = `http://www.oyunincele.me/clash/emotions/thumbs-up.gif`;
          if (Sammelwarn >= 1 || Kriegwarn >= 1) var face = `http://www.oyunincele.me/clash/emotions/angrer.gif`;

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
              legi + "`" + per_leg.toFixed(0) + "% `" + gold + "`" + per_gol.toFixed(0) + "%`" +
              silber + "`" + per_sil.toFixed(0) + "% `" + bronze + "`" + per_bro.toFixed(0) + "%` " +
              cwwins + "Wins `" + dataA.games.warDayWins + "`"
            )
            .addField(
              dataA.clan.name + emoLiga + cwtrophy + "`" + datab.warTrophies + "`",
              pics + "\n" +
              battle + "Teiln:`" + Teiln.toFixed(0) + "%` Wins:`" + Quote.toFixed(0) + "%`      " +
              "     :outbox_tray: `" + dataA.clan.donations + "`" + " :inbox_tray: `" + dataA.clan.donationsReceived + "`"
            )
            .setFooter(
              `${dataA.name}'s verpasste Sammelspiele: ${Sammelwarn} Kriegsspiele: ${Kriegwarn}`, face
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
    }
  });
}