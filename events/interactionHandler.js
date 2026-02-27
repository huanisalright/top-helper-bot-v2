const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { logAction } = require('../utils/logger.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);

            const moderationCmds = ['ban', 'kick', 'warn', 'timeout', 'purge', 'lock', 'unlock'];
            if (moderationCmds.includes(interaction.commandName)) {
                const configPath = path.join(__dirname, '../config.json');
                
                if (fs.existsSync(configPath)) {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    
                    logAction(
                        interaction.client, 
                        '🛡️ T0P Service - Moderation Log', 
                        `**Action:** \`/${interaction.commandName}\`\n**Staff:** ${interaction.user.tag}\n**Channel:** <#${interaction.channel.id}>`,
                        0x5865F2,
                        config.logChannelId
                    );
                }
            }
        } catch (error) {
            console.error(error);
            const msg = { content: 'There was an error while executing this command!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(msg);
            } else {
                await interaction.reply(msg);
            }
        }
    },
};