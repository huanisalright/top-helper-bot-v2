const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm-all')
        .setDescription('Send a DM to ALL server members')
        .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const members = await interaction.guild.members.fetch();
        
        await interaction.reply({ content: `Starting to send DMs to ${members.size} members. This might take a while...`, ephemeral: true });

        let success = 0;
        for (const [id, member] of members) {
            if (member.user.bot) continue;
            try {
                await member.send(`**Announcement from T0P Admin:**\n${message}`);
                success++;
            } catch (err) {
                console.log(`Could not DM ${member.user.tag}`);
            }
        }

        await interaction.followUp({ content: `Successfully sent to ${success} members!`, ephemeral: true });
    },
};