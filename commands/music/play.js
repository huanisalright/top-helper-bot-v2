const { SlashCommandBuilder } = require('discord.js');
const { notif } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or Spotify')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Song name, YouTube URL, or Spotify Link')
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
                `Searching and adding to queue: **${query}**`, 
                0x5865F2
            );
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Music Play Error:', error);
            await interaction.editReply('❌ error wkwk.');
        }
    },
};