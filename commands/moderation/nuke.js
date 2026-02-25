const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Completely wipe all messages in this channel (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const position = interaction.channel.position;
        const newChannel = await interaction.channel.clone();
        
        await interaction.channel.delete();
        await newChannel.setPosition(position);

        const embed = new EmbedBuilder()
            .setTitle('☢️ Channel Nuked')
            .setDescription('This channel has been completely reset by staff.')
            .setImage('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2I4YjJmYjY0YjY0YjY0YjY0YjY0YjY0YjY0YjY0YjY0YjY0YjY0JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/HhTXt43pk1I1W/giphy.gif')
            .setColor(0xFF0000)
            .setTimestamp();

        return await newChannel.send({ embeds: [embed] });
    },
};