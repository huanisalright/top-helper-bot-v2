const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-logs')
        .setDescription('Set the channel for moderation logs')
        .addChannelOption(opt => opt.setName('channel').setDescription('Select the log channel').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel('channel');
        const configPath = path.join(__dirname, '../../config.json');

        let config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
        config.logChannelId = channel.id;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const embed = new EmbedBuilder()
            .setTitle('✅ Logs Configured')
            .setDescription(`Moderation logs will now be sent to ${channel}`)
            .setColor(0x57F287);

        return await interaction.editReply({ embeds: [embed] });
    },
};