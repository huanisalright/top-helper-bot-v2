const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock the current channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: true
        });

        const embed = new EmbedBuilder()
            .setTitle('🔓 Channel Unlocked')
            .setColor(0x57F287)
            .setDescription('This channel has been unlocked. Members can now send messages again.')
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};