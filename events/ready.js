module.exports = async (client) => {
    console.log(
        `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    );

    client.user.setActivity(
        `with Roles`
    );

    client.updateSlashCommands()
}