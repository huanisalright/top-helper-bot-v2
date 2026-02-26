const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Song title or link')
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
            
            if (!searchResults || searchResults.length === 0 || !searchResults[0] || !searchResults[0].url) {
                return interaction.editReply('No results found for your query. Please try another title.');
            }

            const song = searchResults[0];
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = createAudioPlayer({
                behaviors: { noSubscriber: NoSubscriberBehavior.Play }
            });

            player.play(resource);
            connection.subscribe(player);

            const embed = new EmbedBuilder()
                .setTitle('Now Playing')
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnails[0]?.url || null)
                .addFields(
                    { name: 'Duration', value: song.durationRaw || 'Unknown', inline: true },
                    { name: 'Requested by', value: interaction.user.username, inline: true }
                )
                .setColor(0x5865F2)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            player.on('error', error => {
                console.error(`Audio Player Error: ${error.message}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                setTimeout(() => {
                    if (player.state.status === AudioPlayerStatus.Idle) {
                        connection.destroy();
                    }
                }, 300000);
            });

        } catch (error) {
            console.error('Play Error:', error);
            if (interaction.deferred) {
                await interaction.editReply('An error occurred while trying to play the song.');
            }
        }
    },
};