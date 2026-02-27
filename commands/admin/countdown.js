const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Start a countdown for your song release')
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Days until release')
                .setRequired(true)),
    async execute(interaction) {
        const days = interaction.options.getInteger('days');
        
        if (days < 1) {
            return interaction.reply('Days must be at least 1!');
        }

        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + days);

        const embed = {
            color: 0xFF0000,
            title: '🎵 Song Release Countdown',
            description: `Get ready for the drop!`,
            fields: [
                {
                    name: 'Releasing in',
                    value: `**${days}** day${days !== 1 ? 's' : ''}`,
                    inline: true
                },
                {
                    name: 'Release Date',
                    value: `<t:${Math.floor(releaseDate.getTime() / 1000)}:F>`,
                    inline: true
                }
            ],
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [embed] });
    }
};