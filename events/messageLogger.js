const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.MessageDelete,
        async execute(message) {
            if (!message.guild || message.author?.bot) return;
            await sendLog(
                message.guild, 
                '🗑️ Message Deleted', 
                `**Author:** ${message.author}\n**Channel:** ${message.channel}\n**Content:** ${message.content || '*None*'}`, 
                0xED4245
            );
        }
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            if (!oldMessage.guild || oldMessage.author?.bot || oldMessage.content === newMessage.content) return;
            await sendLog(
                oldMessage.guild, 
                '📝 Message Edited', 
                `**Author:** ${oldMessage.author}\n**Channel:** ${oldMessage.channel}\n**Before:** ${oldMessage.content || '*None*'}\n**After:** ${newMessage.content || '*None*'}`, 
                0xFEE75C
            );
        }
    },
    {
        name: Events.MessageBulkDelete,
        async execute(messages) {
            const firstMsg = messages.first();
            if (!firstMsg || !firstMsg.guild) return;
            await sendLog(
                firstMsg.guild, 
                '🧹 Bulk Delete', 
                `**Amount:** ${messages.size} messages deleted in ${firstMsg.channel}`, 
                0xED4245
            );
        }
    }
];