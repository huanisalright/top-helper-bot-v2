const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout/Mute a member')
        .addUserOption(opt => opt.setName('target').setDescription('The member to timeout').setRequired(true))
        .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason');

        if (!target.manageable) return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });

        await target.timeout(duration * 60 * 1000, reason);

        const embed = new EmbedBuilder()
            .setTitle('⏳ Member Timeout')
            .setColor(0xFFA500)
            .setDescription(`**Target:** ${target.user.tag}\n**Duration:** ${duration} Minutes\n**Reason:** ${reason}\n**Staff:** ${interaction.user.tag}`);

        try {
            await target.send({ content: `You have been timed out in **${interaction.guild.name}** for **${duration}m** for: ${reason}` });
        } catch (e) {}

        return interaction.reply({ embeds: [embed] });
    },
};