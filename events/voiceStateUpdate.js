const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = newState.guild;
        if (!oldState.channelId && newState.channelId) {
            await sendLog(guild, 'Voice Join', `${newState.member} joined **${newState.channel.name}**`, 0x57F287);
        } else if (oldState.channelId && !newState.channelId) {
            await sendLog(guild, 'Voice Leave', `${oldState.member} left **${oldState.channel.name}**`, 0xED4245);
        } else if (oldState.channelId !== newState.channelId) {
            await sendLog(guild, 'Voice Move', `${newState.member} moved from **${oldState.channel.name}** to **${newState.channel.name}**`, 0x5865F2);
        }
    },
};