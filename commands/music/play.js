const { SlashCommandBuilder } = require('discord.js');
const { notif } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from Spotify')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Spotify Link or Song Name')
                .setRequired(true)),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        
        if (!voiceChannel) {
            return interaction.reply({ 
                content: 'You need to be in a voice channel to use this command!', 
                ephemeral: true 
            });
        }

        const query = interaction.options.getString('query');
        
        await interaction.deferReply();

        try {
            await interaction.client.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
            
            const embed = notif(
                '🎵 Music System', 
                `Processing your request: **${query}**`, 
                0x1DB954
            );
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Music Play Error:', error);
            
            if (error.message.includes('decipher')) {
                return interaction.editReply('❌ YouTube encryption error. Try updating library or using cookies.');
            }
            
            await interaction.editReply('❌ Failed to play. Make sure it is a valid Spotify link or song name.');
        }
    },
};