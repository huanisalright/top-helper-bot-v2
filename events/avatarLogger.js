const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {
            const oldAvatar = oldMember.user.displayAvatarURL();
            const newAvatar = newMember.user.displayAvatarURL();

            const oldServerAvatar = oldMember.avatarURL();
            const newServerAvatar = newMember.avatarURL();

            if (oldAvatar === newAvatar && oldServerAvatar === newServerAvatar) return;

            await sendLog(
                newMember.guild,
                '📸 Avatar Updated',
                `**User:** ${newMember.user.tag} (${newMember.id})\n` +
                `**New Avatar:** [Click Here](${newMember.displayAvatarURL({ size: 4096 })})`,
                0x5865F2
            );
        }
    }
];