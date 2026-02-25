const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        if (addedRoles.size > 0) {
            await sendLog(
                newMember.guild,
                'Role Added',
                `**User:** ${newMember.user}\n**Added:** ${addedRoles.map(r => r.name).join(', ')}`,
                0x5865F2
            );
        }

        if (removedRoles.size > 0) {
            await sendLog(
                newMember.guild,
                'Role Removed',
                `**User:** ${newMember.user}\n**Removed:** ${removedRoles.map(r => r.name).join(', ')}`,
                0xED4245
            );
        }
    },
};