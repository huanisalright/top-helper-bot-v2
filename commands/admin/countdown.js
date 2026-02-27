const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
                .setDescription('Format: DD/MM/YY')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('artwork')
                .setDescription('URL Image Artwork (Optional)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message from the artist')
                .setRequired(false)),
    async execute(interaction) {
        const artist = interaction.options.getString('artist');
        const title = interaction.options.getString('title');
        const dateInput = interaction.options.getString('date');
        const artwork = interaction.options.getString('artwork');
        const message = interaction.options.getString('message') || 'Coming soon!';
        
        const parts = dateInput.split('/');
        if (parts.length !== 3) {
            return interaction.reply({ content: 'DD/MM/YY', ephemeral: true });
        }

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        if (year < 100) year += 2000;

        const releaseDate = new Date(year, month, day);
        const unixTimestamp = Math.floor(releaseDate.getTime() / 1000);

        if (isNaN(releaseDate.getTime())) {
            return interaction.reply({ content: 'Invalid date!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Song Release Countdown')
            .setDescription(`**${artist}** - *${title}*`)
            .addFields(
                { name: 'Releasing', value: `<t:${unixTimestamp}:R>`, inline: true },
                { name: 'Release Date', value: `<t:${unixTimestamp}:D>`, inline: true },
                { name: 'Message', value: message }
            )
            .setTimestamp()
            .setFooter({ text: 'T0P' });

        if (artwork) {
            embed.setImage(artwork);
        }

        await interaction.reply({ embeds: [embed] });
    }
};