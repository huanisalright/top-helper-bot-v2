const { createEmbed } = require('./embed');

const sendLog = async (guild, title, description, color = 0x2b2d31, thumbnail = null) => {
    const logChannel = guild.channels.cache.find(ch => ch.name === 'message-logs');
    if (!logChannel) return;

    const embed = createEmbed(title, description, color).setTimestamp();
    if (thumbnail) embed.setThumbnail(thumbnail);

    try {
        await logChannel.send({ embeds: [embed] });
    } catch (err) {
        console.error(`Failed to send log: ${err}`);
    }
};

module.exports = { sendLog };