const { Events } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.GuildUpdate,
        async execute(oldGuild, newGuild) {
            if (oldGuild.name !== newGuild.name) {
                await sendLog(newGuild, 'Server Name Updated', `**Old:** ${oldGuild.name}\n**New:** ${newGuild.name}`, 0x5865F2);
            }
        }
    },
    {
        name: Events.GuildRoleCreate,
        async execute(role) {
            await sendLog(role.guild, 'Role Created', `**Name:** ${role.name}\n**ID:** ${role.id}`, 0x57F287);
        }
    },
    {
        name: Events.GuildRoleDelete,
        async execute(role) {
            await sendLog(role.guild, 'Role Deleted', `**Name:** ${role.name}`, 0xED4245);
        }
    },
    {
        name: Events.ChannelCreate,
        async execute(channel) {
            await sendLog(channel.guild, 'Channel Created', `**Name:** ${channel.name}\n**Type:** ${channel.type}`, 0x57F287);
        }
    },
    {
        name: Events.ChannelDelete,
        async execute(channel) {
            await sendLog(channel.guild, 'Channel Deleted', `**Name:** ${channel.name}`, 0xED4245);
        }
    },
    {
        name: Events.ChannelUpdate,
        async execute(oldChannel, newChannel) {
            if (oldChannel.name !== newChannel.name) {
                await sendLog(newChannel.guild, 'Channel Renamed', `**Old:** ${oldChannel.name}\n**New:** ${newChannel}`, 0xFEE75C);
            }
        }
    },
    {
        name: Events.GuildEmojiCreate,
        async execute(emoji) {
            await sendLog(emoji.guild, 'Emoji Created', `**Name:** :${emoji.name}:`, 0x57F287);
        }
    },
    {
        name: Events.ThreadCreate,
        async execute(thread) {
            await sendLog(thread.guild, 'Thread Created', `**Name:** ${thread.name}`, 0x57F287);
        }
    }
];