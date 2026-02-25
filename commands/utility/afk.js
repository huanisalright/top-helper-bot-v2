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
            console.log(`[AFK Notice]: Could not change nickname for ${member.user.tag} (Likely Owner/Higher Role)`);
        }

        const embed = new EmbedBuilder()
            .setTitle('AFK Status Enabled')
            .setDescription(`Status: **${reason}**\n\n*Note: If your name didn't change, it's due to Discord's hierarchy restrictions for Owners.*`)
            .setColor(0xFEE75C)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
    afkUsers
};