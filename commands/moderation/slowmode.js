const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the slowmode for the current channel')
        .addIntegerOption(opt => opt.setName('seconds').setDescription('Slowmode duration in seconds (0 to disable)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');

        await interaction.channel.setRateLimitPerUser(seconds);

        const embed = new EmbedBuilder()
            .setTitle('⏳ Slowmode Updated')
            .setColor(0x5865F2)
            .setDescription(seconds === 0 ? 'Slowmode has been **disabled**.' : `Slowmode set to **${seconds} seconds** per message.`)
            .setTimestamp()
            .setFooter({ text: `Staff: ${interaction.user.tag}` });

        return interaction.reply({ embeds: [embed] });
    },
};