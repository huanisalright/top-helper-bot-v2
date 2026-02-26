const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Song title or YouTube link')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const searchResults = await play.search(query, { limit: 1 });
            if (searchResults.length === 0) {
                return interaction.editReply('No results found for your query.');
            }

            const song = searchResults[0];
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            const embed = new EmbedBuilder()
                .setTitle('Now Playing')
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnails[0].url)
                .addFields(
                    { name: 'Duration', value: song.durationRaw, inline: true },
                    { name: 'Requested by', value: interaction.user.username, inline: true }
                )
                .setColor(0x5865F2)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            player.on(AudioPlayerStatus.Idle, () => {
                setTimeout(() => {
                    if (player.state.status === AudioPlayerStatus.Idle) {
                        connection.destroy();
                    }
                }, 300000);
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while trying to play the song.');
        }
    },
};