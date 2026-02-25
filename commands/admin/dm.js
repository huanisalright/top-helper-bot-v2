const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a direct message to a specific user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to message')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The content of the message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const adminRoleId = process.env.ADMIN_ROLE_ID; //
        
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({ content: 'Kamu tidak punya izin Staff untuk menggunakan ini!', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const messageContent = interaction.options.getString('message');

        try {ß
            await interaction.deferReply({ ephemeral: true });

            await target.send(`**Message from T0P Service Admin:**\n${messageContent}`); //
            
            await interaction.editReply({ content: `Successfully sent message to ${target.username}` }); //
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `Gagal mengirim DM ke ${target.username}. Mungkin DM mereka ditutup.` });
        }
    },
};