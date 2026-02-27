const { SlashCommandBuilder } = require('discord.js');
const { notif } = require('../../utils/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            fetchReply: true, 
            ephemeral: true 
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = notif(
            'Pong!',
            `**Latency:** \`${latency}ms\`\n**API Latency:** \`${apiLatency}ms\``,
            0x00FF00
        );

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};