const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Start a countdown for your song release')
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('Artist name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Song title')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Days until release')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message from the artist')
                .setRequired(false)),
    async execute(interaction) {
        const artist = interaction.options.getString('artist');
        const title = interaction.options.getString('title');
        const days = interaction.options.getInteger('days');
        const message = interaction.options.getString('message') || 'Coming soon!';
        
        if (days < 1) {
            return interaction.reply('Days must be at least 1!');
        }

        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + days);

        const embed = {
            color: 0xFF0000,
            title: '🎵 Song Release Countdown',
            description: `**${artist}** - *${title}*`,
            fields: [
                {
                    name: 'Artist',
                    value: artist,
                    inline: true
                },
                {
                    name: 'Releasing in',
                    value: `**${days}** day${days !== 1 ? 's' : ''}`,
                    inline: true
                },
                {
                    name: 'Release Date',
                    value: `<t:${Math.floor(releaseDate.getTime() / 1000)}:F>`,
                    inline: false
                },
                {
                    name: 'Message from Artist',
                    value: message,
                    inline: false
                }
            ],
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [embed] });
    }
};