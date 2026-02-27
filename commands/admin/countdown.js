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
            option.setName('message')
                .setDescription('Message from the artist')
                .setRequired(false)),
    async execute(interaction) {
        const artist = interaction.options.getString('artist');
        const title = interaction.options.getString('title');
        const dateInput = interaction.options.getString('date');
        const message = interaction.options.getString('message') || 'Coming soon!';
        
        const parts = dateInput.split('/');
        if (parts.length !== 3) {
            return interaction.reply({ content: 'Format salah! Gunakan DD/MM/YY (Contoh: 21/06/26)', ephemeral: true });
        }

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);

        if (year < 100) year += 2000;

        const releaseDate = new Date(year, month, day);
        const now = new Date();

        if (isNaN(releaseDate.getTime())) {
            return interaction.reply({ content: 'Tanggal tidak valid!', ephemeral: true });
        }

        if (releaseDate < now) {
            return interaction.reply({ content: 'Tanggal harus di masa depan, Juan!', ephemeral: true });
        }

        const diffTime = Math.abs(releaseDate - now);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Song Release Countdown')
            .setDescription(`**${artist}** - *${title}*`)
            .addFields(
                { name: 'Releasing in', value: `**${days}** hari lagi`, inline: true },
                { name: 'Release Date', value: `<t:${Math.floor(releaseDate.getTime() / 1000)}:D>`, inline: true },
                { name: 'Message', value: message }
            )
            .setTimestamp()
            .setFooter({ text: 'T0P Service Release Radar' });

        await interaction.reply({ embeds: [embed] });
    }
};