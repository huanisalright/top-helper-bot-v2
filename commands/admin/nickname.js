const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Change the nickname of a member')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to change')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('nick')
                .setDescription('The new nickname')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const nick = interaction.options.getString('nick');

        try {
            await member.setNickname(nick);
            await interaction.reply({ content: `Changed nickname for ${member.user.tag} to **${nick}**`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `I cannot change that user's nickname (Hierarchy issue).`, ephemeral: true });
        }
    },
};