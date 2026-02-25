const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete a specific number of messages')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            const embed = createEmbed('Clear Error', 'Please enter a number between 1 and 100.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);

        const embed = createEmbed('Clear Success', `${interaction.user} deleted **${amount}** messages.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};