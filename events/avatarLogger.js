const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.UserUpdate,
        async execute(oldUser, newUser) {
            if (oldUser.avatar === newUser.avatar) return;
            const guild = newUser.client.guilds.cache.find(g => g.members.cache.has(newUser.id));
            
            if (!guild) return;
            const newAvatarURL = newUser.displayAvatarURL({ size: 4096 });

            await sendLog(
                guild,
                '📸 Avatar Updated',
                `**User:** ${newUser.tag} (${newUser.id})\n**New Avatar:** [Click Here](${newAvatarURL})`,
                0x5865F2,
                newAvatarURL
            );
        }
    }
];