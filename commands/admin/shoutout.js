const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shoutout')
        .setDescription('Give a public shoutout to a legendary member')
        .addUserOption(option => option.setName('target').setDescription('The member to shoutout').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Why are they legendary?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        const embed = new EmbedBuilder()
            .setTitle('🌟 T0P SERVICE SHOUTOUT 🌟')
            .setDescription(`Big respect to ${user}!\n\n**Reason:** ${reason}`)
            .setThumbnail(user.displayAvatarURL())
            .setColor(0x57F287)
            .setFooter({ text: 'Keep being awesome!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};