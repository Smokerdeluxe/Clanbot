exports.run = async (client, message, args) => {
  //--------------------BEDINGUNG--------------------//
  // Berechtigung für?
  const modRole = message.guild.roles.find(role => role.name === "Ältestenrat");
  if (!modRole) return console.log("Die Rolle ist nicht vorhanden.");
  if (!message.member.roles.has(modRole.id)) return message.reply(`\n Dieses Kommando is nur für **${modRole.name}**.`);

  //Eingegebene Nachricht löschen?
  var config = require(`./config.json`);
  if (config.kommandoDelete == `y`) message.delete();

  //Erstes Wort nach Kommando als Befehl definieren
  const Befehl = args[0];
  const Anzahl = args[1];

  // Wenn Befehl nicht vorhanden STOP => Nachricht senden
  if (!Befehl) return message.reply(`\nEs muss ein Tag (#9LRG029U) eingegeben werden!`);

  // Wenn Befehl nicht mit # beginnt STOP => Nachricht senden
  if (!Befehl.startsWith(`#`)) return message.reply(`\nUsertag muss so eingegenen werden #9LRG029U`);

  // Befehl am # teilen und als tag definieren
  const tag = Befehl.split(`#`)[1].toUpperCase();

  //--------------------API ABFRAGE--------------------//
  //**********************************************//
  // API Request ---Spielerabfrage--- ***dataA***
  const request = require(`request`);
  var optionsa = {
    method: `GET`,
    url: `${config.APIurl}/player/${tag}`,
    headers: { auth: process.env.API_SECRET }
  };
  request(optionsa, function(errora, response, bodya) {
    if (errora) throw new Error(errora);
    console.log(bodya)
    // Error Behandlung ist STOP => Nachricht senden
    if (bodya.startsWith(`<`)) return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);
    // Daten als JSON Datei übergeben
    let dataA = JSON.parse(bodya);
    // Error Behandlung ist STOP => Nachricht senden
    if (dataA.status === 400 || dataA.status === 401 || dataA.status === 404)
      return message.reply(`\nFalsches Tag (#9LRG029U) eingegeben!`);
    if (dataA.status === 429 || dataA.statusCode === 500 || dataA.status === 503 || dataA.status === 522)
      return message.reply(`\nProbleme mit der RoayleApi, versuch es später`);

    //**********************************************//
    //API Request ---Clanabfrage Warlog--- ***data***
    var options = {
      method: 'GET',
      url: "https://api.royaleapi.com/clan/" + dataA.clan.tag + "/warlog",
      headers: { auth: process.env.API_SECRET }
    };
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      // Error Behandlung ist STOP => Nachricht senden
      if (body.startsWith("<")) return message.reply("\n Probleme mit der RoayleApi, versuch es später");
      // Daten als JSON Datei übergeben
      let data = JSON.parse(body);
      // Error Behandlung ist STOP => Nachricht senden
      if (data.status === 400 || data.status === 401 || data.status === 404)
        return message.reply("\n Falsches Tag (#9LRG029U) eingegeben!");
      if (data.status === 429 || data.status === 500 || data.status === 503 || data.status === 522)
        return message.reply("\n Probleme mit der RoayleApi, versuch es später");

      //--------------------CODE--------------------//  
      //Emojis abfragen
      const cardlvl = client.emojis.get(`610434858157867008`);
      const cwwarn = client.emojis.get(`610212295112654859`);

      //Anzahl der Kriege von ältester nach neuster
      for (let i = (Anzahl - 1); i >= 0; i--) {

        //Datum/Zeit umformen, +2 Stunden
        var datum = data[i].warEndTime.trim().split(`T`)[0].split(`-`);
        var zeit = data[i].warEndTime.trim().split(`T`)[1].split(`:`);
        var stunde = 2 + parseInt(zeit[0]);
        var datumTag = parseInt(datum[2]);
        var datumMon = parseInt(datum[1]);
        var datumJahr = parseInt(datum[0]);
        if (stunde >= 24) {
          stunde = stunde - 24;
          datumTag = datumTag + 1;
        }
        if (datumMon == [1, 3, 5, 7, 8, 10] && datumTag > 31) {
          datumTag = datumTag - 31;
          datumMon = datumMon + 1;
        }
        if (datumMon == [4, 6, 9, 11] && datumTag > 30) {
          datumTag = datumTag - 30;
          datumMon = datumMon + 1;
        }
        if (datumMon == 2 && datumTag > 28) {
          datumTag = datumTag - 28;
          datumMon = datumMon + 1;
        }
        if (datumMon == 12 && datumTag > 31) {
          datumTag = datumTag - 31;
          datumMon = datumMon - 11;
          datumJahr = datumJahr + 1;
        }

        var ende = `${datumTag}.${datumMon}.${datumJahr} ${(stunde)}:${zeit[1]}`;
        var Sammelwarn = "**`_________" + ende + "_________`** \n" + cardlvl + ": ";
        var Kriegwarn = cwwarn + `: `;

        //Teilnehmer der Kriege auf Verwarnungen prüfen
        Teilnehmer = data[i].participants;

        for (const anz in Teilnehmer) {
          Member = Teilnehmer[anz].name;
          if (Teilnehmer[anz].collectionDayBattlesPlayed < 3) Sammelwarn = Sammelwarn + `${Teilnehmer[anz].name}, ` 
          if (Teilnehmer[anz].battlesPlayed == 0) Kriegwarn = Kriegwarn + `${Teilnehmer[anz].name}, ` 
        }
        message.channel.send(`${Sammelwarn}\n${Kriegwarn}`).catch(console.error);
      }
    });
  });
}