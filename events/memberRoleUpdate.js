const { Events, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        if (addedRoles.size > 0) {
            for (const role of addedRoles.values()) {
                await sendLog(
                    newMember.guild,
                    'Role Added',
                    `**User:** ${newMember.user}\n**Role:** ${role}`,
                    0x5865F2,
                    newMember.user.displayAvatarURL()
                );
            }
        }

        if (removedRoles.size > 0) {
            for (const role of removedRoles.values()) {
                await sendLog(
                    newMember.guild,
                    'Role Removed',
                    `**User:** ${newMember.user}\n**Role:** ${role}`,
                    0xED4245,
                    newMember.user.displayAvatarURL()
                );
            }
        }
    },
};