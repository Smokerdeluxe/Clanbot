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
    if (bodya.startsWith("<")) return message.reply(`\n Probleme mit der RoayleApi, versuch es später`);
    // Daten als JSON Datei übergeben
    let dataA = JSON.parse(bodya);
    // Error Behandlung ist STOP => Nachricht senden
    if (dataA.statusCode === 400) return message.reply(`\nFalsches Tag (#9LRG029U) eingegeben!`);
    if (dataA.statusCode === 401) return message.reply(`\nEtws mit dem Api-Token stimmt nicht. Bitte melde es <@404331123900940298>!`);
    if (dataA.statusCode === 403) return message.reply(`\nForbidden!`);
    if (dataA.statusCode === 417) return message.reply(`\nExpaction failed!`);
    if (dataA.statusCode === 429) return message.reply(`\nZu viele Api-Abfragen... Bitte warte ein wenig!`);
    if (dataA.statusCode === 500) return message.reply(`\nProbleme mit der Royale-API... Versuch es später nochmal!`);
    if (dataA.statusCode === 501) return message.reply(`\nProbleme mit der Royale-API... Versuch es später nochmal!`);
    if (dataA.statusCode === 503) return message.reply(`\nProbleme mit der Royale-API... Versuch es später nochmal!`);
    if (dataA.statusCode === 522) return message.reply(`\nProbleme mit der Royale-API... Versuch es später nochmal!`);

    //Discord.js laden, um Embed zu erstellen
    const Discord = require(`discord.js`);

    //Emojis definieren
    const trophys = client.emojis.get(`609806255493742651`);
    const trophysPB = client.emojis.get(`609806379242356817`);
    const legi = client.emojis.get(`609804490584883210`);
    const gold = client.emojis.get(`609804716758794262`);
    const silber = client.emojis.get(`609804751479242753`);
    const bronze = client.emojis.get(`609804786921111557`);
    const battle = client.emojis.get(`609806421063761920`);
    const cardlvl = client.emojis.get(`610434858157867008`);
    const cwwins = client.emojis.get(`610052821102100480`);

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

    // Festlegen welcher Clan passt
    var eignung1 = eignung2 = eignung3 = cwWins1 = cwWins2 = cwWins3 = ``;
    var c1leg = c2leg = c3leg = c1gol = c2gol = c3gol = ``;
    var c1sil = c2sil = c3sil = c1bro = c2bro = c3bro = ``;

    // Über Clan 1
    if (per_leg >= config.legi1 && per_gol >= config.gold1 && per_sil >= config.silber1 && per_bro >= config.bronze1) {
      eignung1 = config.clan1;
      var cardsLeg1 = config.legi1;
      var cardsGol1 = config.gold1;
      var cardsSil1 = config.silber1;
      var cardsBro1 = config.bronze1;
      var cwWinsS1 = config.warwins1;
      var cwQuote1 = config.quote1;

      // Festlegen der + / - Werte
      c1leg = (per_leg.toFixed(0) - cardsLeg1);
      if (c1leg >= 0) c1leg = `+${c1leg}`;
      c1gol = (per_gol.toFixed(0) - cardsGol1);
      if (c1gol >= 0) c1gol = `+${c1gol}`;
      c1sil = (per_sil.toFixed(0) - cardsSil1);
      if (c1sil >= 0) c1sil = `+${c1sil}`
      c1bro = (per_bro.toFixed(0) - cardsBro1);
      if (c1bro >= 0) c1bro = `+${c1bro}`
      cwWins1 = (dataA.games.warDayWins - cwWinsS1);
      if (cwWins1 >= 0) cwWins1 = `+${cwWins1}`;

      //Nachricht senden
      const embedINFO = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setAuthor(
          `${dataA.name} | #${tag}`,
          `http://www.oyunincele.me/clash/levels/${dataA.stats.level}.png`,
          `https://royaleapi.com/player/${tag}`
        )
        .setTitle(
          trophys + "`" + dataA.trophies + "` " + trophysPB + "`" + dataA.stats.maxTrophies + "`"
        )
        .setDescription(
          legi + "`" + per_leg.toFixed(0) + "% `" + gold + "`" + per_gol.toFixed(0) + "%`" +
          silber + "`" + per_sil.toFixed(0) + "% `" + bronze + "`" + per_bro.toFixed(0) + "%` " +
          cwwins + "Wins `" + dataA.games.warDayWins + "`"
        )
        .addField(
          eignung1 + "  " + battle + " Quote Soll: `" + cwQuote1 + "%`",
          legi + "`" + c1leg + "%`" + gold + "`" + c1gol + "%`" +
          silber + "`" + c1sil + "%`" + bronze + "`" + c1bro + "%`" +
          cwwins + "`" + cwWins1 + "`"
        )
        .addField(
          `\u200b`,
          `Die Winrate (letzte 20 Kriege) sollte über \nQuote Soll liegen, ist bei [RoyaleApi](https://royaleapi.com/player/${tag}) abgfragbar. \n(ganz unten "ClanWarHistory", rote Felder \n sind verpasste Finale.)`
        )
        .setFooter(
          `Anhand der Kartenlevel ist ${dataA.name} am besten für die ${eignung1} geeignet!`
        )
      return message.channel.send(embedINFO).catch(console.error);
    }

    //Kleinste Anforderung
    if (per_leg >= 0 && per_gol >= 0 && per_sil >= 0 && per_bro >= 0) {
      eignung1 = config.clan5;
      eignung2 = config.clan6;
      eignung3 = config.clan7;
      var cardsLeg1 = config.legi5;
      var cardsGol1 = config.gold5;
      var cardsSil1 = config.silber5;
      var cardsBro1 = config.bronze5;
      var cwWinsS1 = config.warwins5;
      var cwQuote1 = config.quote5;
      var cardsLeg2 = config.legi6;
      var cardsGol2 = config.gold6;
      var cardsSil2 = config.silber6;
      var cardsBro2 = config.bronze6;
      var cwWinsS2 = config.warwins6;
      var cwQuote2 = config.quote6;
      var cardsLeg3 = config.legi7;
      var cardsGol3 = config.gold7;
      var cardsSil3 = config.silber7;
      var cardsBro3 = config.bronze7;
      var cwWinsS3 = config.warwins7;
      var cwQuote3 = config.quote7;
    }

    // Besser als Clan 5
    if (per_leg >= config.legi5 && per_gol >= config.gold5 && per_sil >= config.silber5 && per_bro >= config.bronze5) {
      eignung1 = config.clan3;
      eignung2 = config.clan4;
      eignung3 = config.clan5;
      var cardsLeg1 = config.legi3;
      var cardsGol1 = config.gold3;
      var cardsSil1 = config.silber3;
      var cardsBro1 = config.bronze3;
      var cwWinsS1 = config.warwins3;
      var cwQuote1 = config.quote3;
      var cardsLeg2 = config.legi4;
      var cardsGol2 = config.gold4;
      var cardsSil2 = config.silber4;
      var cardsBro2 = config.bronze4;
      var cwWinsS2 = config.warwins4;
      var cwQuote2 = config.quote4;
      var cardsLeg3 = config.legi5;
      var cardsGol3 = config.gold5;
      var cardsSil3 = config.silber5;
      var cardsBro3 = config.bronze5;
      var cwWinsS3 = config.warwins5;
      var cwQuote3 = config.quote5;
    }

    //Besser als Clan 3
    if (per_leg >= config.legi3 && per_gol >= config.gold3 && per_sil >= config.silber3 && per_bro >= config.bronze3) {
      eignung1 = config.clan1;
      eignung2 = config.clan2;
      eignung3 = config.clan3;
      var cardsLeg1 = config.legi1;
      var cardsGol1 = config.gold1;
      var cardsSil1 = config.silber1;
      var cardsBro1 = config.bronze1;
      var cwWinsS1 = config.warwins1;
      var cwQuote1 = config.quote1;
      var cardsLeg2 = config.legi2;
      var cardsGol2 = config.gold2;
      var cardsSil2 = config.silber2;
      var cardsBro2 = config.bronze2;
      var cwWinsS2 = config.warwins2;
      var cwQuote2 = config.quote2;
      var cardsLeg3 = config.legi3;
      var cardsGol3 = config.gold3;
      var cardsSil3 = config.silber3;
      var cardsBro3 = config.bronze3;
      var cwWinsS3 = config.warwins3;
      var cwQuote3 = config.quote3;
    }

    // Festlegen der + / - Werte Clan1
    c1leg = (per_leg.toFixed(0) - cardsLeg1);
    if (c1leg >= 0) c1leg = `+${c1leg}`;
    c1gol = (per_gol.toFixed(0) - cardsGol1);
    if (c1gol >= 0) c1gol = `+${c1gol}`;
    c1sil = (per_sil.toFixed(0) - cardsSil1);
    if (c1sil >= 0) c1sil = `+${c1sil}`;
    c1bro = (per_bro.toFixed(0) - cardsBro1);
    if (c1bro >= 0) c1bro = `+${c1bro}`;
    cwWins1 = (dataA.games.warDayWins - cwWinsS1);
    if (cwWins1 >= 0) cwWins1 = `+${cwWins1}`;

    // Festlegen der + / - Werte Clan2
    c2leg = (per_leg.toFixed(0) - cardsLeg2);
    if (c2leg >= 0) c2leg = `+${c2leg}`;
    c2gol = (per_gol.toFixed(0) - cardsGol2);
    if (c2gol >= 0) c2gol = `+${c2gol}`;
    c2sil = (per_sil.toFixed(0) - cardsSil2);
    if (c2sil >= 0) c2sil = `+${c2sil}`;
    c2bro = (per_bro.toFixed(0) - cardsBro2);
    if (c2bro >= 0) c2bro = `+${c2bro}`;
    cwWins2 = (dataA.games.warDayWins - cwWinsS2);
    if (cwWins2 >= 0) cwWins2 = `+${cwWins2}`;

    // Festlegen der + / - Werte Clan3
    c3leg = (per_leg.toFixed(0) - cardsLeg3);
    if (c3leg >= 0) c3leg = `+${c3leg}`;
    c3gol = (per_gol.toFixed(0) - cardsGol3);
    if (c3gol >= 0) c3gol = `+${c3gol}`;
    c3sil = (per_sil.toFixed(0) - cardsSil3);
    if (c3sil >= 0) c3sil = `+${c3sil}`;
    c3bro = (per_bro.toFixed(0) - cardsBro3);
    if (c3bro >= 0) c3bro = `+${c3bro}`;
    cwWins3 = (dataA.games.warDayWins - cwWinsS3);
    if (cwWins3 >= 0) cwWins3 = `+${cwWins3}`;

    //Nachricht senden
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
        eignung1 + "  " + battle + " Quote Soll: `" + cwQuote1 + "%`",
        legi + "`" + c1leg + "%`" + gold + "`" + c1gol + "%`" +
        silber + "`" + c1sil + "%`" + bronze + "`" + c1bro + "%`" +
        cwwins + "`" + cwWins1 + "`"
      )
      .addField(
        eignung2 + "  " + battle + " Quote Soll: `" + cwQuote2 + "%`",
        legi + "`" + c2leg + "%`" + gold + "`" + c2gol + "%`" +
        silber + "`" + c2sil + "%`" + bronze + "`" + c2bro + "%`" +
        cwwins + "`" + cwWins2 + "`"
      )
      .addField(
        eignung3 + "  " + battle + " Quote Soll: `" + cwQuote3 + "%`",
        legi + "`" + c3leg + "%`" + gold + "`" + c3gol + "%`" +
        silber + "`" + c3sil + "%`" + bronze + "`" + c3bro + "%`" +
        cwwins + "`" + cwWins3 + "`"
      )
      .addField(
        `\u200b`,
        `Die Winrate (letzte 20 Kriege) sollte über \nQuote Soll liegen, ist bei [RoyaleApi](https://royaleapi.com/player/${tag}) abgfragbar. \n(ganz unten "ClanWarHistory", rote Felder \n sind verpasste Finale.)`
      )
      .setFooter(
        `Anhand der Kartenlevel ist ${dataA.name} am besten für die ${eignung2} oder ${eignung3} geeignet!`
      )
    message.channel.send(embedINFO).catch(console.error);
  });
}
