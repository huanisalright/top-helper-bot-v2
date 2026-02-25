const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.GuildMemberAdd,
        async execute(member) {
            await sendLog(member.guild, 'Member Joined', `**User:** ${member.user.tag}`, 0x57F287, member.user.displayAvatarURL());
        }
    },
    {
        name: Events.GuildMemberRemove,
        async execute(member) {
            await sendLog(member.guild, 'Member Left', `**User:** ${member.user.tag}`, 0xED4245);
        }
    },
    {
        name: Events.GuildBanAdd,
        async execute(ban) {
            await sendLog(ban.guild, 'User Banned', `**User:** ${ban.user.tag}\n**Reason:** ${ban.reason || 'No reason'}`, 0xED4245);
        }
    },
    {
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {
            if (oldMember.nickname !== newMember.nickname) {
                await sendLog(newMember.guild, 'Nickname Change', `**User:** ${newMember.user}\n**Old:** ${oldMember.nickname || 'None'}\n**New:** ${newMember.nickname || 'None'}`, 0x5865F2);
            }
            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            if (addedRoles.size > 0) {
                await sendLog(newMember.guild, 'Role Added', `**User:** ${newMember.user}\n**Added:** ${addedRoles.map(r => r.name).join(', ')}`, 0x5865F2);
            }
        }
    },
    {
        name: Events.InviteCreate,
        async execute(invite) {
            await sendLog(invite.guild, 'Invite Created', `**Code:** ${invite.code}\n**By:** ${invite.inviter.tag}`, 0xFEE75C);
        }
    }
];