exports.run = async (client, message, args, Discord, config, fehler, logging, fertig, warnung, privat) => {
  
  if(message.member.user.id == `388384477925081108`){
  
  const messageArgs = args.slice(1)

  let roleID = `500429154190360586`

  let membersWithRole = message.guild.roles.get(roleID).members.map(m => m.user.id);

  for (const key in membersWithRole) {
    userID = membersWithRole[key];
    client.users.get(userID).send(messageArgs.join(" "))
    console.log(userID)
  }
  }else{message.channel.send(`Nicht berechtigt!`)}
}
