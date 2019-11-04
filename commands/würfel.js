exports.run = async (client, message, args) => {

    var min = 1;
    var max = 6
    var Zahl = Math.floor(Math.random() * (max - min + 1)) + min;

    message.channel.send(
        "Du hast eine **" + Zahl + "** gewürfelt!"
    )

}

