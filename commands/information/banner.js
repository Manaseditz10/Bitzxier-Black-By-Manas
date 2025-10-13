const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'banner',
    aliases: [],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        try {
            let member;

            // Check if user is provided by mention or ID
            if (args[0]) {
                member = await getUserFromMention(message, args[0]);
                if (!member) {
                    try {
                        member = await client.users.fetch(args[0]); // Fetch user by ID
                    } catch (error) {
                        member = message.member; // Default to the message author if user isn't found
                    }
                }
            } else {
                member = message.member; // Default to the message sender if no args are passed
            }

            // Ensure member and member.user are defined before using them
            if (!member || !member.user) {
                member = message.member;
            }

            const guildMember = message.guild.members.cache.get(member.id);

            // Fetch user data to get the user banner
            const userData = await axios
                .get(`https://discord.com/api/users/${member.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                })
                .then((res) => res.data)
                .catch(() => null);

            const userBanner = userData && userData.banner
                ? `https://cdn.discordapp.com/banners/${member.id}/${userData.banner}${
                    userData.banner.startsWith('a_') ? '.gif' : '.png'
                }?size=4096`
                : null;

            // Fetch guild member banner using the provided request
            let serverBanner = null;
            try {
                const guildMemberData = await client.snek.get(
                    `https://discord.com/api/guilds/${message.guild.id}/members/${member.id}`,
                    {
                        headers: {
                            Authorization: `Bot ${client.token}`,
                        },
                    }
                );
                if (guildMemberData && guildMemberData.data && guildMemberData.data.avatar) {
                    serverBanner = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${member.id}/avatars/${guildMemberData.data.banner}${
                        guildMemberData.data.banner.startsWith('a_') ? '.gif' : '.png'
                    }?size=4096`;
                }
            } catch (error) {
                console.error('Error fetching guild member banner:', error);
            }

            // Prepare the initial embed (user banner if available)
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(userBanner ? `User Banner of ${member.user.tag}` : `User Banner not found for ${member.user.tag}`)
                .setFooter({ text: `Requested by: ${message.author.tag}` });

            if (userBanner) {
                embed.setImage(userBanner);
            }

            // Buttons to toggle between user and server banners
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('user_banner')
                    .setLabel('User Banner')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(!userBanner),
                new ButtonBuilder()
                    .setCustomId('server_banner')
                    .setLabel('Server Banner')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(!serverBanner)
            );

            const msg = await message.channel.send({ embeds: [embed], components: [buttons] });

            // Button interaction collector
            const filter = (interaction) => interaction.isButton() && interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.user.id !== message.author.id) return interaction.reply({ content: 'This is not your interaction..!!', ephemeral: true });
                if (interaction.customId === 'user_banner') {
                    embed.setDescription(`User Banner of ${member.user.tag}`);
                    embed.setImage(userBanner);
                    await interaction.update({ embeds: [embed] });
                } else if (interaction.customId === 'server_banner') {
                    embed.setDescription(`Server Banner of ${member.user.tag}`);
                    embed.setImage(serverBanner);
                    await interaction.update({ embeds: [embed] });
                }
            });

            collector.on('end', () => {
                const disabledButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('user_banner')
                        .setLabel('User Banner')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('server_banner')
                        .setLabel('Server Banner')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                );
                msg.edit({ components: [disabledButtons] });
            });
        } catch (error) {
            console.error('Error fetching user banner:', error);
            return message.reply({ content: 'An error occurred while fetching the user banner..!!' });
        }
    },
};

// Function to resolve a user from mention or ID
async function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return await message.client.users.fetch(id).catch(() => null) || message.member;
}
