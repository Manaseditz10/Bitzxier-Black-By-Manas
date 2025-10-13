const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    cooldown: 5,
    premium: true,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix || client.config.PREFIX; // Default prefix if not set

        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'AntiNuke',
                        description: 'Get All AntiNuke Command List',
                        value: 'antinuke',
                        emoji: `${client.emoji.antinuke}`
                    },
                    {
                        label: 'Moderation',
                        description: 'Get All Moderation Command List',
                        value: 'moderation',
                        emoji: `${client.emoji.mod}`
                    },
                    {
                        label: 'Automod',
                        description: 'Get All Automod Command List',
                        value: 'automod',
                        emoji: `${client.emoji.automod}`
                    },
                    {
                        label: 'Logger',
                        description: 'Get All Logger Command List',
                        value: 'logger',
                        emoji: `${client.emoji.logs}`
                    },
                    {
                        label: 'Utility',
                        description: 'Get All Utility Command List',
                        value: 'utility',
                        emoji: `${client.emoji.utillity}`
                    },
                    {
                        label: 'Server Utility',
                        description: 'Get All Server Utility Command List',
                        value: 'serverutility',
                        emoji: `${client.emoji.serverutillity}`
                    },
                    {
                        label: 'Auto Responder',
                        description: 'Get All Auto Responder Command List',
                        value: 'autoresponder',
                        emoji: `${client.emoji.autoresponder}`
                    }
                ])
        );

        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop2')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'Verification',
                        description: 'Get All Verification Command List',
                        value: 'verification',
                        emoji: `${client.emoji.verification}`
                    },
                    {
                        label: 'Join To Create',
                        description: 'Get All Join To Create Command List',
                        value: 'jointocreate',
                        emoji: `${client.emoji.jtc}`
                    },
                    {
                        label: 'Voice',
                        description: 'Get All Voice Command List',
                        value: 'voice',
                        emoji: `${client.emoji.vc}`
                    },
                    {
                        label: 'Custom Role',
                        description: 'Get All Custom Role Command List',
                        value: 'customrole',
                        emoji: `${client.emoji.customrole}`
                    },
                    {
                        label: 'Welcomer',
                        description: 'Get All Welcomer Command List',
                        value: 'welcomer',
                        emoji: `${client.emoji.welcome}`
                    },
                    {
                        label: 'Sticky',
                        description: 'Get All Sticky Command List',
                        value: 'sticky',
                        emoji: `${client.emoji.sticky}`
                    },
                    {
                    label : 'Ticket',
                    description : 'Get All Ticket Command List',
                    value : 'ticket',
                    emoji : `${client.emoji.ticket}`
                    },
                ])
        );

        const categories = {
            category1: [
                `**${client.emoji.antinuke} \`:\` AntiNuke**`,
                `**${client.emoji.mod} \`:\` Moderation**`,
                `**${client.emoji.automod} \`:\` Automod**`,
                `**${client.emoji.logs} \`:\` Logger**`,
                `**${client.emoji.utillity} \`:\` Utility**`,
                `**${client.emoji.serverutillity} \`:\` Server Utility**`,
                `**${client.emoji.autoresponder} \`:\` Auto Responder**`

            ],
            category2: [
                `**${client.emoji.verification} \`:\` Verification**`,
                `**${client.emoji.jtc} \`:\` Join To Create**`,
                `**${client.emoji.vc} \`:\` Voice**`,
                `**${client.emoji.customrole} \`:\` Custom Role**`,
                `**${client.emoji.welcome} \`:\` Welcomer**`,
                `**${client.emoji.sticky} \`:\` Sticky**`,
                `**${client.emoji.ticket} \`:\` Ticket**`
            ]
        };

        let developerUser = client.users.cache.get(`216020418216198146`) ? client.users.cache.get(`216020418216198146`) : await client.users.fetch(`216020418216198146`).catch((err) => null)

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `${client.emoji.dot} **Prefix for this server:** \`${prefix}\`\n` +
                `${client.emoji.dot} **Total Commands:** \`${client.util.countCommandsAndSubcommands(client)}\`\n` +
                `${client.emoji.dot} **Type \`&antinuke enable\` to get started!**\n\n${client.config.baseText}`
            )
            .addFields({
                name: `${client.emoji.categories} **__Categories__**`,
                value: categories.category1.join('\n'),
                inline: true
            })
            .addFields({
                name: '\u200B',
                value: categories.category2.join('\n'),
                inline: true
            })
            .addFields({
                name: `${client.emoji.link} **__Links__**`,
                value: `**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](${client.config.support})**`
            })
            .setFooter({
                text: `Developed with ❤️ Black </>`,
                iconURL: developerUser.displayAvatarURL({ dynamic: true })
            });

        await message.channel.send({ embeds: [embed], components: [row1, row2] });
    }
};
