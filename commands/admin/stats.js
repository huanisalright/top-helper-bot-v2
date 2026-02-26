const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Check bot status and RAM usage'),
    async execute(interaction) {
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        
        const embed = new EmbedBuilder()
            .setTitle('Bot Performance Stats')
            .setColor(0x2b2d31)
            .addFields(
                { name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true },
                { name: 'Uptime', value: `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:R>`, inline: true },
                { name: 'Latency', value: `\`${interaction.client.ws.ping}ms\``, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    },
};