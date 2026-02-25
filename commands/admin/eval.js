const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate JavaScript code (Owner Only)')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to evaluate')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.user.id !== '342857213619994627') {
            return interaction.reply({ content: 'Only the bot owner can use this!', ephemeral: true });
        }

        const code = interaction.options.getString('code');
        try {
            const result = eval(code);
            await interaction.reply({ content: `**Result:**\n\`\`\`js\n${result}\n\`\`\``, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `**Error:**\n\`\`\`js\n${error}\n\`\`\``, ephemeral: true });
        }
    },
};