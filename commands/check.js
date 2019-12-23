exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {

  //Eingegebene Nachricht löschen?
  if (config.deleteCheck == `y`) message.delete(config.deleteTime * 1000);

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
    const trophys = client.emojis.get(`609806255493742651`);
    const trophysPB = client.emojis.get(`609806379242356817`);
    const maxi = client.emojis.get(`658258500937580585`)
    const legi = client.emojis.get(`609804490584883210`);
    const gold = client.emojis.get(`609804716758794262`);
    const silber = client.emojis.get(`609804751479242753`);
    const bronze = client.emojis.get(`609804786921111557`);
    const battle = client.emojis.get(`609806421063761920`);
    const cardlvl = client.emojis.get(`610434858157867008`);
    const cwwins = client.emojis.get(`610052821102100480`);

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

    // Festlegen welcher Clan passt
    var eignung = eignung1 = eignung2 = eignung3 = cwWins1 = cwWins2 = cwWins3 = c1max = c2max = c3max = c1leg = c2leg = c3leg = c1gol = c2gol = c3gol = c1sil = c2sil = c3sil = c1bro = c2bro = c3bro = ``;

    let clans = config.clanCR.map(c => c.clan);
    for (let nR = clans.length - 1; nR >= 0; nR--) {

      if (per_max >= config.clanCR[nR].maxi && per_leg >= config.clanCR[nR].legi && per_gol >= config.clanCR[nR].gold && per_sil >= config.clanCR[nR].silber && per_bro >= config.clanCR[nR].bronze) {

        if (nR > 0) { var a = nR - 1; } else { var a = nR; }
        if (a >= clans.length - 3) { a = clans.length - 4 }
        eignung1 = config.clanCR[a].clan;
        var cardsMax1 = config.clanCR[a].maxi;
        var cardsLeg1 = config.clanCR[a].legi;
        var cardsGol1 = config.clanCR[a].gold;
        var cardsSil1 = config.clanCR[a].silber;
        var cardsBro1 = config.clanCR[a].bronze;
        var cwWinsS1 = config.clanCR[a].warwins;
        var cwQuote1 = config.clanCR[a].quote;
        let c = a + 1; if (c >= clans.length - 1) { var i = clans.length - 1; } else { var i = c; }
        eignung2 = config.clanCR[i].clan;
        var cardsMax2 = config.clanCR[i].maxi;
        var cardsLeg2 = config.clanCR[i].legi;
        var cardsGol2 = config.clanCR[i].gold;
        var cardsSil2 = config.clanCR[i].silber;
        var cardsBro2 = config.clanCR[i].bronze;
        var cwWinsS2 = config.clanCR[i].warwins;
        var cwQuote2 = config.clanCR[i].quote;
        let d = i + 1; if (d >= clans.length - 2) { var b = clans.length - 2; } else { var b = d; }
        eignung3 = config.clanCR[b].clan;
        var cardsMax3 = config.clanCR[b].maxi;
        var cardsLeg3 = config.clanCR[b].legi;
        var cardsGol3 = config.clanCR[b].gold;
        var cardsSil3 = config.clanCR[b].silber;
        var cardsBro3 = config.clanCR[b].bronze;
        var cwWinsS3 = config.clanCR[b].warwins;
        var cwQuote3 = config.clanCR[b].quote;
      }
    }

    // Festlegen der + / - Werte Clan1
    c1max = (per_max.toFixed(0) - cardsMax1);
    if (c1max >= 0) c1max = `+${c1max}`;
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
    // Festlegen der + / - Werte Clan2
    c2max = (per_max.toFixed(0) - cardsMax2);
    if (c2max >= 0) c2max = `+${c2max}`;
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
    c3max = (per_max.toFixed(0) - cardsMax3);
    if (c3max >= 0) c3max = `+${c3max}`;
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

    //Festlegen der Eignung des Spielers
    if (a == 0) eignung = eignung + `${eignung1}`;
    if (a > 0) eignung = eignung + `${eignung2} oder ${eignung3}`;

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
        maxi + "`" + per_max.toFixed(0) + "% `" + legi + "`" + per_leg.toFixed(0) + "% `" + gold + "`" + per_gol.toFixed(0) + "%`" +
        silber + "`" + per_sil.toFixed(0) + "% `" + bronze + "`" + per_bro.toFixed(0) + "%` " +
        cwwins + "Wins `" + dataA.games.warDayWins + "`"
      )
      .addField(
        eignung1 + "  " + battle + " Quote Soll: `" + cwQuote1 + "%`",
        maxi + "`" + c1max + "%`" + legi + "`" + c1leg + "%`" + gold + "`" + c1gol + "%`" +
        silber + "`" + c1sil + "%`" + bronze + "`" + c1bro + "%`" +
        cwwins + "`" + cwWins1 + "`"
      )
      .addField(
        eignung2 + "  " + battle + " Quote Soll: `" + cwQuote2 + "%`",
        maxi + "`" + c2max + "%`" + legi + "`" + c2leg + "%`" + gold + "`" + c2gol + "%`" +
        silber + "`" + c2sil + "%`" + bronze + "`" + c2bro + "%`" +
        cwwins + "`" + cwWins2 + "`"
      )
      .addField(
        eignung3 + "  " + battle + " Quote Soll: `" + cwQuote3 + "%`",
        maxi + "`" + c3max + "%`" + legi + "`" + c3leg + "%`" + gold + "`" + c3gol + "%`" +
        silber + "`" + c3sil + "%`" + bronze + "`" + c3bro + "%`" +
        cwwins + "`" + cwWins3 + "`"
      )
      .addField(
        `\u200b`,
        `Die Winrate (letzte 20 Kriege) sollte über \nQuote Soll liegen, ist bei [RoyaleApi](https://royaleapi.com/player/${tag}) abgfragbar. \n(ganz unten "ClanWarHistory", rote Felder \n sind verpasste Finale.)`
      )
      .setFooter(
        `Anhand der Kartenlevel ist ${dataA.name} \nam besten für ${eignung} geeignet! \nDie folgende Nachricht in Browser kopieren \num Spieler einzuladen!`
      )
    await message.channel.send(embedINFO).then(message.channel.send(`clashroyale://playerInfo?id=${tag}`)).catch(console.error);
    return console.log(`Check für ${dataA.name} erfolgreich durchgeführt!`)
  });
}
