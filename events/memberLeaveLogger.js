const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const { guild } = member;
        
        const logTitle = '📤 Member Left';
        const logDesc = `**Member:** ${member.user.tag}\n**ID:** ${member.id}\n\nleave, pasti dibully dadang awokawok.`;

        await sendLog(
            guild,
            logTitle,
            logDesc,
            0xe74c3c,
            member.user.displayAvatarURL()
        );
    },
};