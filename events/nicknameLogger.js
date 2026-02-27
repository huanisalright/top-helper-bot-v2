const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.nickname !== newMember.nickname) {
            
            const oldNick = oldMember.nickname || oldMember.user.username;
            const newNick = newMember.nickname || newMember.user.username;
            const avatar = newMember.user.displayAvatarURL();

            await sendLog(
                newMember.guild, 
                '👤 Nickname Changed', 
                `**Member:** ${newMember.user.tag}\n**ID:** ${newMember.id}\n\n**Before:** \`${oldNick}\` \n**After:** \`${newNick}\``,
                0x3498db,
                avatar
            );
        }
    },
};