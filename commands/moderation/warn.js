const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { sendLog } = require('../../utils/logger');
const { notif } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Issue a warning to a member')
        .addUserOption(opt => opt.setName('target').setDescription('The member to warn').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('The reason for the warning').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const warnPath = path.join(__dirname, '../../warnings.json');

        let warns = fs.existsSync(warnPath) ? JSON.parse(fs.readFileSync(warnPath, 'utf8')) : {};
        if (!warns[target.id]) warns[target.id] = [];
        
        const newWarn = { 
            reason, 
            staff: interaction.user.tag, 
            date: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }) 
        };
        
        warns[target.id].push(newWarn);
        fs.writeFileSync(warnPath, JSON.stringify(warns, null, 2));

        const dmEmbed = notif(
            `⚠️ Warning: ${interaction.guild.name}`,
            `You have received a formal warning.\n\n**Reason:** ${reason}\n**Total Warnings:** ${warns[target.id].length}`,
            0xFFFF00
        );

        try { 
            await target.send({ embeds: [dmEmbed] }); 
        } catch (e) {
            console.log(`Could not send DM to ${target.tag}`);
        }

        await sendLog(
            interaction.guild,
            'Member Warned',
            `**Target:** ${target.tag} (${target.id})\n**Staff:** ${interaction.user.tag}\n**Reason:** ${reason}\n**Total Warns:** ${warns[target.id].length}`,
            0xFFFF00,
            target.displayAvatarURL()
        );

        return await interaction.editReply({ content: `✅ **${target.tag}** has been successfully warned.` });
    },
};