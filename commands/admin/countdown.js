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
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Release date (format: DD/MM/YY +HH:MM GMT)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message from the artist (optional)')
                .setRequired(false)),
    async execute(interaction) {
        const artist = interaction.options.getString('artist');
        const title = interaction.options.getString('title');
        const dateString = interaction.options.getString('date');
        const message = interaction.options.getString('message') || 'Coming soon!';
        
        const releaseDate = new Date(dateString);
        
        if (isNaN(releaseDate.getTime())) {
            return interaction.reply('Invalid date format! Use: DD/MM/YY +HH:MM GMT');
        }

        if (releaseDate < new Date()) {
            return interaction.reply('Release date must be in the future!');
        }

        const days = Math.ceil((releaseDate - new Date()) / (1000 * 60 * 60 * 24));

        const embed = {
            color: 0xFF0000,
            title: 'Song Release Countdown',
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