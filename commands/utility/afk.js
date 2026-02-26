const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const afkUsers = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your status to AFK')
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for going AFK')),
    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.member;

        if (afkUsers.has(member.id)) {
            return interaction.reply({ content: 'You are already AFK!', ephemeral: true });
        }

        const oldNickname = member.displayName;
        afkUsers.set(member.id, {
            nickname: oldNickname,
            reason: reason,
            time: Date.now()
        });

        try {
            await member.setNickname(`[AFK] ${oldNickname.substring(0, 25)}`);
        } catch (err) {
            console.log(err);
        }

        const embed = new EmbedBuilder()
            .setTitle('AFK Status Enabled')
            .setDescription(`Reason: **${reason}**\n\n*This message will be deleted in 15 seconds.*`)
            .setColor(0xFEE75C)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => {
            interaction.deleteReply().catch(err => {});
        }, 15000);
    },
    afkUsers
};