const { SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Update bot presence')
        .addStringOption(opt => opt.setName('text').setDescription('Content of the activity').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        interaction.client.user.setActivity(text, { type: ActivityType.Listening });

        return await interaction.reply({ 
            content: `Bot activity updated to: **Listening ${text}**`, 
            ephemeral: true 
        });
    },
};