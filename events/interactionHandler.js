const { EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);

            const moderationCmds = ['ban', 'kick', 'warn', 'timeout', 'purge', 'lock', 'unlock'];
            if (moderationCmds.includes(interaction.commandName)) {
                const configPath = path.join(__dirname, '../config.json');
                
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    const logChannel = interaction.guild.channels.cache.get(config.logChannelId);

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('🛡️ T0P Service - Moderation Log')
                            .setColor(0x5865F2)
                            .addFields(
                                { name: 'Action', value: `\`/${interaction.commandName}\``, inline: true },
                                { name: 'Staff', value: `${interaction.user.tag}`, inline: true },
                                { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Log System' });

                        await logChannel.send({ embeds: [logEmbed] }).catch(() => null);
                    }
                }
            }
        } catch (error) {
            console.error('Command Error:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};