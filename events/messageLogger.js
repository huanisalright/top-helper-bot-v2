const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.MessageDelete,
        async execute(message) {
            if (message.author?.bot) return;
            await sendLog(message.guild, 'Message Deleted', `**Author:** ${message.author}\n**Channel:** ${message.channel}\n**Content:** ${message.content || '*None*'}`, 0xED4245);
        }
    },
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            if (oldMessage.author?.bot || oldMessage.content === newMessage.content) return;
            await sendLog(oldMessage.guild, 'Message Edited', `**Author:** ${oldMessage.author}\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`, 0xFEE75C);
        }
    },
    {
        name: Events.MessageBulkDelete,
        async execute(messages) {
            await sendLog(messages.first().guild, 'Bulk Delete', `**Amount:** ${messages.size} messages deleted in ${messages.first().channel}`, 0xED4245);
        }
    }
];