const { EmbedBuilder } = require('discord.js');

module.exports = {
    promo: (data) => {
        const { artist, title, unix, artwork, message } = data;
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🚀 Song Release Countdown')
            .setDescription(`**${artist}** - *${title}*`)
            .addFields(
                { name: 'Releasing', value: `<t:${unix}:R>`, inline: true },
                { name: 'Release Date', value: `<t:${unix}:D>`, inline: true },
                { name: 'Message', value: message }
            )
            .setTimestamp()
            .setFooter({ text: 'T0P Service Release Radar' });
        
        if (artwork) embed.setImage(artwork);
        return embed;
    },

    notif: (title, description, color = 0x5865F2) => {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: 'Log System' });
    },

    jadwalNext: (matkul, status) => {
        const embed = new EmbedBuilder()
            .setColor(status === 'none' ? 0xFF0000 : 0x00FF00)
            .setTitle('🏗️ Jadwal Kuliah Mendatang')
            .setTimestamp()
            .setFooter({ text: 'Civil Engineering Itenas • SUSU BETA' });

        if (status === 'none') {
            embed.setDescription('Tidak ada lagi jadwal kuliah hari ini. Waktunya fokus garap musik atau santai! 🎸');
        } else {
            embed.setDescription(`Mata kuliah kamu berikutnya adalah:`)
                 .addFields(
                     { name: '📚 Mata Kuliah', value: `**${matkul.matkul}**`, inline: true },
                     { name: '🕒 Jam', value: `\`${matkul.jam}\``, inline: true }
                 );
        }
        return embed;
    }
};