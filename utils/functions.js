module.exports = client => {
    client.updateSlashCommands = async () => {
        const data = {
            name: "reactions",
            description: "Reaction Role",
            options: [{
                name: "create",
                description: "Creates A reaction Role Embed",
                type: 1,
                options: [{
                    name: "channel",
                    description: "Whats the channel where the message is stored?",
                    type: 7,
                    required: true
                }, {
                    name: "url",
                    description: "Whats the url for the embed(s)",
                    type: 3,
                    required: true
                }]
            }, {
                name: "edit",
                description: "Edits A reaction Role Embed",
                type: 1,
                options: [{
                    name: "channel",
                    description: "Whats the channel where the message is stored?",
                    type: 7,
                    required: true
                }, {
                    name: "message",
                    description: "Whats the message id for the embed which you wish to mark as unique?",
                    type: 3,
                    required: true
                }, {
                    name: "url",
                    description: "Whats the url for the embed(s)",
                    type: 3,
                    required: true
                }]
            }]
        }
        const command = client.guilds.cache.get(process.env.GUILD)?.commands.create(data);
        const command2 = client.guilds.cache.get("879945540719247380")?.commands.create(data);

    }
}