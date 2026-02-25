const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(opt => opt.setName('target').setDescription('Member').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const warnPath = path.join(__dirname, '../../warnings.json');

        let warns = fs.existsSync(warnPath) ? JSON.parse(fs.readFileSync(warnPath, 'utf8')) : {};
        if (!warns[target.id]) warns[target.id] = [];
        warns[target.id].push({ reason, staff: interaction.user.tag, date: new Date().toLocaleDateString() });
        fs.writeFileSync(warnPath, JSON.stringify(warns, null, 2));

        const dmEmbed = new EmbedBuilder()
            .setTitle(`⚠️ Warning: ${interaction.guild.name}`)
            .setColor(0xFFFF00)
            .addFields({ name: 'Reason', value: reason }, { name: 'Total Warnings', value: `${warns[target.id].length}` });

        try { await target.send({ embeds: [dmEmbed] }); } catch (e) {}

        const logEmbed = new EmbedBuilder()
            .setTitle('Member Warned')
            .setColor(0xFFFF00)
            .setDescription(`**Target:** ${target.tag}\n**Staff:** ${interaction.user.tag}\n**Reason:** ${reason}`);

        return await interaction.editReply({ embeds: [logEmbed] });
    },
};