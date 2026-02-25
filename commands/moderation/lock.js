const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock the current channel to prevent members from chatting')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {

        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false
        });

        const embed = new EmbedBuilder()
            .setTitle('🔒 Channel Locked')
            .setColor(0xFF0000)
            .setDescription('This channel has been locked by staff. Members cannot send messages until it is unlocked.')
            .addFields(
                { name: 'Staff', value: `${interaction.user.tag}`, inline: true },
                { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'T0P Service Moderation' });

        return interaction.reply({ embeds: [embed] });
    },
};