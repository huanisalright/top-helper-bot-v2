const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const { SpotifyPlugin } = require('@distube/spotify');
const cron = require('node-cron');
const jadwalKuliah = require('./jadwal_data.js');
const { notif } = require('./utils/embed.js');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildVoiceStates
    ] 
});

client.distube = new DisTube(client, {
    plugins: [new YouTubePlugin(), new SpotifyPlugin()],
    leaveOnEmpty: true,
    leaveOnFinish: false,
    emitNewSongOnly: true,
});

client.commands = new Collection();
const commandsJSON = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    if (!fs.lstatSync(commandsPath).isDirectory()) continue;
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commandsJSON.push(command.data.toJSON());
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.distube.on('playSong', (queue, song) => {
    const channel = queue.textChannel;
    if (channel) {
        channel.send(`🎶 Now playing: **${song.name}** - \`${song.formattedDuration}\``);
    }
});

client.distube.on('error', (channel, error) => {
    console.error(error);
    if (channel) channel.send(`❌ Music Error: ${error.message.slice(0, 100)}`);
});

const deployCommands = async () => {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsJSON },
        );
    } catch (error) {
        console.error('Deploy Error:', error);
    }
};

cron.schedule('* * * * *', () => {
    const sekarang = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const target = new Date(sekarang.getTime() + 60 * 60 * 1000); 
    const hari = target.getDay();
    const jamMenit = `${target.getHours().toString().padStart(2, '0')}:${target.getMinutes().toString().padStart(2, '0')}`;
    const matkul = jadwalKuliah.find(k => k.hari === hari && k.jam === jamMenit);

    if (matkul) {
        const channel = client.channels.cache.get('1476454680895819910');
        if (channel) {
            const embed = notif('⚠️ CLASS REMINDER!', `One hour left until **${matkul.matkul}** class at **${matkul.jam}**.`);
            channel.send({ embeds: [embed] }).catch(() => null);
        }
    }
});

(async () => {
    await deployCommands();
    client.login(process.env.DISCORD_TOKEN);
})();