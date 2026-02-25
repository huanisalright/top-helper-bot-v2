const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member and send DM reason')
        .addUserOption(opt => opt.setName('target').setDescription('The member to ban').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason');

        if (!target) return interaction.editReply({ content: 'User not found!' });
        if (!target.bannable) return interaction.editReply({ content: 'I cannot ban this user.' });

        const dmEmbed = new EmbedBuilder()
            .setTitle(`🔨 Banned from ${interaction.guild.name}`)
            .setColor(0xFF0000)
            .addFields({ name: 'Reason', value: reason }, { name: 'Staff', value: interaction.user.tag });

        try { await target.send({ embeds: [dmEmbed] }); } catch (e) {}

        await target.ban({ reason });

        const logEmbed = new EmbedBuilder()
            .setTitle('Member Banned')
            .setColor(0xFF0000)
            .setDescription(`**Target:** ${target.user.tag}\n**Staff:** ${interaction.user.tag}\n**Reason:** ${reason}`);

        return await interaction.editReply({ embeds: [logEmbed] });
    },
};