const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { sendLog } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('Clear all warnings for a member')
        .addUserOption(opt => opt.setName('target').setDescription('The member whose warnings will be cleared').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const target = interaction.options.getUser('target');
        const warnPath = path.join(__dirname, '../../warnings.json');

        if (!fs.existsSync(warnPath)) {
            return await interaction.editReply({ content: 'No warnings found in the database.' });
        }

        let warns = JSON.parse(fs.readFileSync(warnPath, 'utf8'));

        if (!warns[target.id] || warns[target.id].length === 0) {
            return await interaction.editReply({ content: `**${target.tag}** already has no warnings.` });
        }

        const totalCleared = warns[target.id].length;
        delete warns[target.id];
        fs.writeFileSync(warnPath, JSON.stringify(warns, null, 2));

        await sendLog(
            interaction.guild,
            'Warnings Cleared',
            `**Target:** ${target.tag} (${target.id})\n**Staff:** ${interaction.user.tag}\n**Amount Cleared:** ${totalCleared} warnings`,
            0x2ecc71,
            target.displayAvatarURL()
        );

        return await interaction.editReply({ content: `✅ Successfully cleared all warnings (**${totalCleared}**) for **${target.tag}**.` });
    },
};