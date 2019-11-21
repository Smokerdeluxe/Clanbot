exports.run = async (client, message, args) => {

  const roleArgs = args.slice(0, 1);
  const messageArgs = args.slice(1)

  const role = message.guild.roles.find(role => role.name.toLowerCase() === roleArgs.join(" ").toLowerCase())
  if (!role) return message.reply('Die Rolle ist nicht vorhanden!');

  let roleID = role.id

  let membersWithRole = message.guild.roles.get(roleID).members.map(m => m.user.id);

  for (const key in membersWithRole) {
    userID = membersWithRole[key];
    client.users.get(userID).send(messageArgs.join(" "))
    console.log(userID)
  }
}