const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal-emoji')
        .setDescription('Add an emoji to the server from a URL')
        .addStringOption(option => option.setName('url').setDescription('The direct URL of the emoji image').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('The name for the new emoji').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageExpressions),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const name = interaction.options.getString('name');

        try {
            const emoji = await interaction.guild.emojis.create({ attachment: url, name: name });
            await interaction.reply({ content: `Successfully added the emoji: ${emoji}`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Failed to add emoji. Make sure the URL is valid and the image is under 256kb.', ephemeral: true });
        }
    },
};