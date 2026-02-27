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
        if (status === 'found') {
            return new EmbedBuilder()
                .setTitle('📚 Next Class Alert!')
                .setDescription(`The next class is **${matkul.matkul}** at **${matkul.jam}**. Get ready! 🚀`)
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter({ text: 'T0P Service - Schedule Info' });
        } else {
            return new EmbedBuilder()
                .setTitle('📚 No More Classes Today!')
                .setDescription('There are no more classes scheduled for the rest of the day. Enjoy your free time! 🎉')
                .setColor(0xFF0000)
                .setTimestamp()
                .setFooter({ text: 'T0P Service - Schedule Info' });
        }
    }   
};