const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send announcement')
        .addChannelOption(opt => opt.setName('channel').setDescription('Target channel').setRequired(true))
        .addStringOption(opt => opt.setName('title').setDescription('Title').setRequired(true))
        .addStringOption(opt => opt.setName('message').setDescription('Message (use \n for new lines)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setTitle(` ${title}`)
            .setDescription(message.replace(/\\n/g, '\n'))
            .setColor('#ffffff')
            .setTimestamp()
            .setFooter({ text: `T0P • Posted by ${interaction.user.username}` });

        try {
            await channel.send({ embeds: [embed] });
            return await interaction.editReply({ content: 'Announcement posted!' });
        } catch (error) {
            console.error(error);
            return await interaction.editReply({ content: 'Failed to send announcement.' });
        }
    },
};