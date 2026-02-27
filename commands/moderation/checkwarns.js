const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { notif } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkwarns')
        .setDescription('Check the warning history of a member')
        .addUserOption(opt => opt.setName('target').setDescription('The member to check').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const target = interaction.options.getUser('target');
        const warnPath = path.join(__dirname, '../../warnings.json');

        if (!fs.existsSync(warnPath)) {
            return await interaction.editReply({ content: 'No warnings have been recorded in this server yet.' });
        }

        let warns = JSON.parse(fs.readFileSync(warnPath, 'utf8'));
        const userWarns = warns[target.id];

        if (!userWarns || userWarns.length === 0) {
            return await interaction.editReply({ content: `**${target.tag}** has a clean record with 0 warnings.` });
        }

        const warnList = userWarns.map((w, i) => 
            `**${i + 1}. Reason:** ${w.reason}\n**Staff:** ${w.staff}\n**Date:** ${w.date}`
        ).join('\n\n');

        const embed = notif(
            `Warning History: ${target.tag}`,
            `Total Warnings: **${userWarns.length}**\n\n${warnList}`,
            0x3498db
        );
        embed.setThumbnail(target.displayAvatarURL());

        return await interaction.editReply({ embeds: [embed] });
    },
};