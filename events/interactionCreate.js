const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Message
} = require('discord.js');
const unshortener = require('unshortener');


module.exports = async (client, interaction) => {

    // Check if its a command 
    if (interaction.isCommand()) {

        let logChannel;

        if (interaction.guild.id == "424012709219008522") {
            if (!interaction.member.roles.cache.some(role => role.id == "474034125582499840")) {
                if (!interaction.member.roles.cache.some(role => role.id == "760600558871511101")) return
            }
            logChannel = await interaction.guild.channels.fetch("749113963987468369")
        } else if (interaction.guild.id == "879945540719247380") {
            if (!interaction.member.roles.cache.some(role => role.id == "879945540719247380")) return
            logChannel = await interaction.guild.channels.fetch("883945251335708682")
        }

        // if (!interaction.member.roles.cache.some(role => role.id == "474034125582499840")) return

        let command = interaction.commandName
        let subCommand = interaction.options._subcommand
        let options = interaction.options._hoistedOptions


        if (command == "reactions") {
            if (subCommand == "create") {
                let longURL = options.find(o => o.name === 'url').value

                // you can pass in a url object or string
                unshortener.expand(longURL,
                    async function (err, URLobj) {

                        let url = URLobj.href

                        let base64 = JSON.parse(new Buffer.from(url.split("?data=")[1], 'base64').toString())
                        let selectedChannel = options.find(o => o.name === 'channel').channel;

                        let formattedEmbeds = []

                        const buttons = []

                        base64.messages[0].data.embeds.forEach(embed => {

                            if (embed.footer) {
                                let data = embed.footer.text.split(/\n/)
                                let row = 0
                                let first = true

                                data.forEach(command => {
                                    subData = command.split("|")

                                    if (command == "[SPLIT]") {
                                        row++
                                        first = true
                                    } else if (subData[0] == "REGULAR" || "UNIQUE" || "PERSISTENT" || "LINK" || "CHANNEL" || "RCOUNT" || "PCOUNT") {
                                        if (first) {
                                            if (subData[0] == "LINK") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setURL(subData[1])
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                ))
                                            } else if (subData[0] == "CHANNEL") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setURL(`https://discord.com/channels/${process.env.GUILD}/${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                ))
                                            } else if (subData[0] == "RCOUNT" || subData[0] == "PCOUNT") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}|${subData[2]}|0|${subData[3]}`)
                                                    .setLabel(`${subData[2]} (0/${subData[3]})`)
                                                    .setStyle('SECONDARY'),
                                                ))
                                                if (subData.length == 5) {
                                                    buttons[row].components[0].setEmoji(subData[4])
                                                }
                                            } else {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('SECONDARY'),
                                                ))

                                                if (subData.length == 4) {
                                                    buttons[row].components[0].setEmoji(subData[3])
                                                }
                                            }
                                            first = false
                                        } else {
                                            if (subData[0] == "LINK") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setURL(subData[1])
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                )
                                            } else if (subData[0] == "CHANNEL") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setURL(`https://discord.com/channels/${process.env.GUILD}/${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                )
                                            } else if (subData[0] == "RCOUNT" || subData[0] == "PCOUNT") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}|${subData[2]}|0|${subData[3]}`)
                                                    .setLabel(`${subData[2]} (0/${subData[3]})`)
                                                    .setStyle('SECONDARY'),
                                                )
                                                if (subData.length == 5) {
                                                    buttons[row].components[buttons[row].components.length - 1].setEmoji(subData[4])
                                                }
                                            } else {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('SECONDARY'),
                                                )

                                                if (subData.length == 4) {
                                                    buttons[row].components[buttons[row].components.length - 1].setEmoji(subData[3])
                                                }
                                            }
                                        }
                                    }
                                });

                                // Then
                                embed.footer = {}
                            }
                            formattedEmbeds.push(embed)
                        });

                        return await selectedChannel.send({
                            embeds: formattedEmbeds,
                            components: buttons
                        }).then(msg => {
                            interaction.reply({
                                content: `Created the embed with the ID: ${msg.id} in ${selectedChannel}!`,
                                ephemeral: true
                            })

                            const logEmbed = new MessageEmbed()
                                .setTitle('Embed Created')
                                .setDescription(`[Embed URL](${longURL})`)

                            logChannel.send({
                                embeds: [logEmbed]
                            });

                        })
                    });

            } else if (subCommand == "edit") {

                let longURL = options.find(o => o.name === 'url').value

                // you can pass in a url object or string
                unshortener.expand(longURL,
                    async function (err, URLobj) {

                        let url = URLobj.href

                        let base64 = JSON.parse(new Buffer.from(url.split("?data=")[1], 'base64').toString())
                        let selectedChannel = options.find(o => o.name === 'channel').channel;
                        let messageId = options.find(o => o.name === 'message').value;
                        let message = await selectedChannel.messages.fetch(messageId)
                            .catch(() => {
                                interaction.reply({
                                    content: `Could not find a message with the id ${messageId} in ${selectedChannel}`,
                                    ephemeral: true
                                })
                            });

                        let formattedEmbeds = []

                        const buttons = []

                        base64.messages[0].data.embeds.forEach(embed => {

                            if (embed.footer) {
                                let data = embed.footer.text.split(/\n/)
                                let row = 0
                                let first = true

                                data.forEach(command => {
                                    subData = command.split("|")
                                    if (command == "[SPLIT]") {
                                        row++
                                        first = true
                                    } else if (subData[0] == "REGULAR" || "UNIQUE" || "PERSISTENT" || "LINK" || "CHANNEL" || "RCOUNT" || "PCOUNT") {
                                        if (first) {
                                            if (subData[0] == "LINK") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setURL(subData[1])
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                ))
                                            } else if (subData[0] == "CHANNEL") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setURL(`https://discord.com/channels/${process.env.GUILD}/${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                ))
                                            } else if (subData[0] == "RCOUNT" || subData[0] == "PCOUNT") {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}|${subData[2]}|0|${subData[3]}`)
                                                    .setLabel(`${subData[2]} (0/${subData[3]})`)
                                                    .setStyle('SECONDARY'),
                                                ))
                                                if (subData.length == 5) {
                                                    buttons[row].components[0].setEmoji(subData[4])
                                                }
                                            } else {
                                                buttons.push(new MessageActionRow().addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('SECONDARY'),
                                                ))

                                                if (subData.length == 4) {
                                                    buttons[row].components[0].setEmoji(subData[3])
                                                }
                                            }
                                            first = false
                                        } else {
                                            if (subData[0] == "LINK") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setURL(subData[1])
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                )
                                            } else if (subData[0] == "CHANNEL") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setURL(`https://discord.com/channels/${process.env.GUILD}/${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('LINK'),
                                                )
                                            } else if (subData[0] == "RCOUNT" || subData[0] == "PCOUNT") {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}|${subData[2]}|0|${subData[3]}`)
                                                    .setLabel(`${subData[2]} (0/${subData[3]})`)
                                                    .setStyle('SECONDARY'),
                                                )
                                                if (subData.length == 5) {
                                                    buttons[row].components[buttons[row].components.length - 1].setEmoji(subData[4])
                                                }
                                            } else {
                                                buttons[row].addComponents(
                                                    new MessageButton()
                                                    .setCustomId(`${subData[0].toLowerCase()}|${subData[1]}`)
                                                    .setLabel(subData[2])
                                                    .setStyle('SECONDARY'),
                                                )

                                                if (subData.length == 4) {
                                                    buttons[row].components[buttons[row].components.length - 1].setEmoji(subData[3])
                                                }
                                            }
                                        }
                                    }
                                });

                                // Then
                                embed.footer = {}
                            }
                            formattedEmbeds.push(embed)
                        });

                        return await message.edit({
                            embeds: formattedEmbeds,
                            components: buttons
                        }).catch(err => {
                            interaction.reply({
                                content: `Attempted to edit the embed with the ID: ${messageId} in ${selectedChannel} but failed. Could this embed not be sent by Hinata?`,
                                ephemeral: true
                            })
                        }).then(() => {
                            interaction.reply({
                                content: `Edited the embed with the ID: ${messageId} in ${selectedChannel}!`,
                                ephemeral: true
                            })

                            console.log(logChannel)

                            const logEmbed = new MessageEmbed()
                                .setTitle('Embed Edited')
                                .setDescription(`[Embed URL](${longURL})`)

                            logChannel.send({
                                embeds: [logEmbed]
                            });
                        })
                    })
            }
        }
    }

    // Check if its a button
    if (interaction.isMessageComponent() && interaction.componentType == 'BUTTON') {
        let data = interaction.customId.split("|")
        let member = interaction.member
        if (data[0] == "regular") {
            let role = interaction.guild.roles.cache.find(r => r.id === data[1]);
            if (member.roles.cache.some(role => role.id === data[1])) {
                member.roles.remove(role);
                return interaction.reply({
                    content: `Successfully removed the ${role} role.`,
                    ephemeral: true
                })
            } else {
                member.roles.add(role);
                return interaction.reply({
                    content: `Successfully added the ${role} role. This is a regular button, click it again to add or remove the role.`,
                    ephemeral: true
                })
            }
        } else if (data[0] == "persistent") {
            let role = interaction.guild.roles.cache.find(r => r.id === data[1]);
            if (member.roles.cache.some(role => role.id === data[1])) {
                return interaction.reply({
                    content: `You already have the ${role} role. This is a persistent button, it is only able to add the role.`,
                    ephemeral: true
                })
            } else {
                member.roles.add(role);
                return interaction.reply({
                    content: `Successfully added the ${role} role. This is a persistent button, it is only able to add the role.`,
                    ephemeral: true
                })
            }
        } else if (data[0] == "uall") {
            let role = interaction.guild.roles.cache.find(r => r.id === data[1]);
            if (member.roles.cache.some(role => role.id === data[1])) {
                member.roles.remove(role);
                return interaction.reply({
                    content: `Successfully removed the ${role} role.`,
                    ephemeral: true
                })
            } else {

                // Check if the user has any of the other roles from all of the buttons on the message also marked as unique
                let components = interaction.message.components

                let removed = []

                components.forEach((row, index) => {
                    row.components.forEach(async (value, index2) => {
                        let buttonData = value.customId.split("|")
                        if (buttonData[0] == "uall") {
                            if (member.roles.cache.some(role => role.id === buttonData[1])) {
                                let roleToRemove = interaction.guild.roles.cache.find(r => r.id === buttonData[1])
                                member.roles.remove(roleToRemove);
                                removed.push(`<@&${roleToRemove.id}>`)
                            }
                        }
                    });
                });

                // Finally add the role
                member.roles.add(role);
                if (removed.length == 0) {
                    return interaction.reply({
                        content: `Successfully added the ${role} role. This is a unique button, you can only add one of the roles in its group.`,
                        ephemeral: true
                    })
                } else {
                    return interaction.reply({
                        content: `Successfully added the ${role} role and removed the ${removed.join(", ")} role(s). This is a unique button, you can only add one of the roles in its group.`,
                        ephemeral: true
                    })
                }
            }
        } else if (data[0] == "urow") {
            let role = interaction.guild.roles.cache.find(r => r.id === data[1]);
            if (member.roles.cache.some(role => role.id === data[1])) {
                member.roles.remove(role);
                return interaction.reply({
                    content: `Successfully removed the ${role} role.`,
                    ephemeral: true
                })
            } else {

                // Check if the user has any of the other roles from all of the buttons on the message also marked as unique
                let components = interaction.message.components
                let removed = []
                // Find out which row the current button is on
                components.forEach((row, index) => {
                    row.components.forEach((firstValue) => {
                        if (firstValue.customId == interaction.customId) {
                            components[index].components.forEach(async (value) => {
                                let buttonData = value.customId.split("|")
                                if (buttonData[0] == "urow") {
                                    if (member.roles.cache.some(role => role.id === buttonData[1])) {
                                        let roleToRemove = interaction.guild.roles.cache.find(r => r.id === buttonData[1])
                                        member.roles.remove(roleToRemove);
                                        removed.push(`<@&${roleToRemove.id}>`)
                                    }
                                }
                            })
                        }
                    });
                });

                member.roles.add(role);
                if (removed.length == 0) {
                    return interaction.reply({
                        content: `Successfully added the ${role} role. This is a unique button, you can only add one of the roles in its group.`,
                        ephemeral: true
                    })
                } else {
                    return interaction.reply({
                        content: `Successfully added the ${role} role and removed the ${removed.join(", ")} role(s). This is a unique button, you can only add one of the roles in its group.`,
                        ephemeral: true
                    })
                }
            }
        } else if (data[0] == "rcount" || data[0] == "pcount") {
            //${subData[2]}|${subData[3]}|0`)

            let role = interaction.guild.roles.cache.find(r => r.id === data[1]);
            let components = interaction.message.components

            // Check if the limits been reached
            if (data[3] >= data[4]) {
                return interaction.reply({
                    content: `The count limit has been reached.`,
                    ephemeral: true
                })
            } else {
                if (!member.roles.cache.some(role => role.id === data[1])) {
                    member.roles.add(role);
                    interaction.reply({
                        content: `Successfully added the ${role} role. This is a count button, you got pos ${Number(data[3]) + 1}/${data[4]}.`,
                        ephemeral: true
                    })

                    // Update the count

                    components.forEach((row, index) => {
                        row.components.forEach((value, index2) => {
                            if (value.customId == interaction.customId) {
                                components[index].components[index2].label = `${data[2]} (${Number(data[3]) + 1}/${data[4]})`
                                components[index].components[index2].customId = `${data[0]}|${data[1]}|${data[2]}|${Number(data[3]) + 1}|${data[4]}`
                            }
                        });
                    });

                    return await interaction.message.edit({
                        components: components
                    })


                } else {
                    if (data[0] == "pcount") {
                        return interaction.reply({
                            content: `You cannot remove a count based role.`,
                            ephemeral: true
                        })
                    } else {
                        member.roles.remove(role);
                        interaction.reply({
                            content: `Successfully removed the ${role} role. This is a count button, you got pos ${Number(data[3]) - 1}/${data[4]}.`,
                            ephemeral: true
                        })

                        // Update the count

                        components.forEach((row, index) => {
                            row.components.forEach((value, index2) => {
                                if (value.customId == interaction.customId) {
                                    if (data[3] != 0) {
                                        components[index].components[index2].label = `${data[2]} (${Number(data[3]) - 1}/${data[4]})`
                                        components[index].components[index2].customId = `${data[0]}|${data[1]}|${data[2]}|${Number(data[3]) - 1}|${data[4]}`
                                    }
                                }
                            });
                        });

                        return await interaction.message.edit({
                            components: components
                        })
                    }

                }
            }
        }

    }
}