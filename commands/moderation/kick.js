const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member and send DM reason')
        .addUserOption(opt => opt.setName('target').setDescription('The member to kick').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason');

        if (!target || !target.kickable) return interaction.editReply({ content: 'Cannot kick this user.' });

        const dmEmbed = new EmbedBuilder()
            .setTitle(`👢 Kicked from ${interaction.guild.name}`)
            .setColor(0xFFA500)
            .addFields({ name: 'Reason', value: reason }, { name: 'Staff', value: interaction.user.tag });

        try { await target.send({ embeds: [dmEmbed] }); } catch (e) {}

        await target.kick(reason);

        const logEmbed = new EmbedBuilder()
            .setTitle('Member Kicked')
            .setColor(0xFFA500)
            .setDescription(`**Target:** ${target.user.tag}\n**Staff:** ${interaction.user.tag}\n**Reason:** ${reason}`);

        return await interaction.editReply({ embeds: [logEmbed] });
    },
};