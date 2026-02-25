const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway (Admin Only)')
        .addStringOption(opt => opt.setName('prize').setDescription('Giveaway prize').setRequired(true))
        .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g., 1m, 1h)').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const msDuration = ms(interaction.options.getString('duration'));
        const winnerCount = interaction.options.getInteger('winners');

        if (!msDuration) return interaction.reply({ content: 'Invalid duration!', ephemeral: true });

        const endTimestamp = Math.floor((Date.now() + msDuration) / 1000);
        const embed = new EmbedBuilder()
            .setTitle('🎉 T0P SERVICE GIVEAWAY 🎉')
            .setDescription(`🎁 **Prize:** ${prize}\n👥 **Winners:** ${winnerCount}\n⏰ **Ends:** <t:${endTimestamp}:R>`)
            .setColor(0x5865F2);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_giveaway').setLabel('Join').setStyle(ButtonStyle.Primary).setEmoji('🎉'),
            new ButtonBuilder().setCustomId('leave_giveaway').setLabel('Leave').setStyle(ButtonStyle.Danger)
        );

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const participants = new Set();
        const collector = message.createMessageComponentCollector({ time: msDuration });

        collector.on('collect', async i => {
            if (i.customId === 'join_giveaway') {
                if (participants.has(i.user.id)) return i.reply({ content: 'Already in!', ephemeral: true });
                participants.add(i.user.id);
                await i.reply({ content: 'Successfully joined! 🎉', ephemeral: true });
            } else if (i.customId === 'leave_giveaway') {
                participants.delete(i.user.id);
                await i.reply({ content: 'Left the giveaway.', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            const list = Array.from(participants);
            const winners = [];
            for (let i = 0; i < winnerCount && list.length > 0; i++) {
                winners.push(`<@${list.splice(Math.floor(Math.random() * list.length), 1)}>`);
            }
            await message.edit({ components: [] });
            interaction.channel.send(winners.length ? `Congratulations ${winners.join(', ')}! You won **${prize}**! 🏆` : 'No participants.');
        });
    },
};