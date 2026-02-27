const { notif } = require('./embed');

const sendLog = async (guild, title, description, color = 0x2b2d31, thumbnail = null) => {
    const logChannel = guild.channels.cache.find(ch => ch.name === 'message-logs');
    if (!logChannel) return;

    const embed = notif(title, description, color);
    if (thumbnail) embed.setThumbnail(thumbnail);

    try {
        await logChannel.send({ embeds: [embed] });
    } catch (err) {
        console.error(`Failed to send log: ${err}`);
    }
};

const logAction = (client, title, description, color = 0x5865F2, customChannelId = null) => {
    const channelId = customChannelId || '1476454680895819910'; 
    const logChannel = client.channels.cache.get(channelId);
    
    if (logChannel) {
        const embed = notif(title, description, color);
        logChannel.send({ embeds: [embed] }).catch(() => null);
    }
};

module.exports = { sendLog, logAction };