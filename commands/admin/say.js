const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot send a message in this specific channel')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message content to send')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const targetChannelId = '1455504683593633872';
        const messageContent = interaction.options.getString('message');

        if (interaction.channelId !== targetChannelId) {
            return interaction.reply({ 
                content: `This command can only be used in <#${targetChannelId}>!`, 
                ephemeral: true 
            });
        }

        try {
            await interaction.channel.send(messageContent);
            
            await interaction.reply({ 
                content: 'Message successfully sent!', 
                ephemeral: true 
            });
        } catch (error) {
            console.error('Error in say command:', error);
            await interaction.reply({ 
                content: 'Failed to send the message.', 
                ephemeral: true 
            });
        }
    },
};