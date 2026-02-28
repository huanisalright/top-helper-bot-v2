const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.UserUpdate,
    async execute(oldUser, newUser) {
        if (oldUser.avatar === newUser.avatar) return;

        const guild = newUser.client.guilds.cache.first(); 
        
        const oldAvatar = oldUser.displayAvatarURL({ dynamic: true, size: 4096 });
        const newAvatar = newUser.displayAvatarURL({ dynamic: true, size: 4096 });

        await sendLog(
            guild,
            'Member Avatar Updated',
            `**User:** ${newUser.tag}\n**Previous:** [View Old Avatar](${oldAvatar})\n**Current:** [View New Avatar](${newAvatar})`,
            0x5865F2
        );
    }
};