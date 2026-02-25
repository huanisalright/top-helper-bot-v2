const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nudge')
        .setDescription('Gives a friendly nudge to a member')
        .addUserOption(option => option.setName('target').setDescription('Who to nudge?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const embed = new EmbedBuilder()
            .setTitle('👋 Admin is calling you!')
            .setDescription(`Hey ${user}, an admin from **T0P Service** is trying to get your attention! Please check the chat.`)
            .setColor(0xFEE75C)
            .setTimestamp();

        await interaction.channel.send({ content: `${user}`, embeds: [embed] });
        await interaction.reply({ content: 'Nudge sent!', ephemeral: true });
    },
};