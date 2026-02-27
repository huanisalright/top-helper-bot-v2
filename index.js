const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron'); 
const jadwalKuliah = require('./jadwal_data.js');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ] 
});
// timezone error?? harusnya udah GMT +7
cron.schedule('* * * * *', () => {
    const sekarang = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const satuJamLagi = new Date(sekarang.getTime() + 60 * 60 * 1000);
    
    const hariSekarang = satuJamLagi.getDay(); 
    const jamMenit = `${satuJamLagi.getHours().toString().padStart(2, '0')}:${satuJamLagi.getMinutes().toString().padStart(2, '0')}`;

    const matkulSkrg = jadwalKuliah.find(k => k.hari === hariSekarang && k.jam === jamMenit);

    if (matkulSkrg) {
        const channel = client.channels.cache.get('1476454680895819910'); 
        if (channel) {
            channel.send(`⚠️ **REMINDER KULIAH!**\nSatu jam lagi ada kelas **${matkulSkrg.matkul}** jam **${matkulSkrg.jam}**.\nPersiapkan diri kamu! 📚`);
        }
    }
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
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

process.on('unhandledRejection', error => console.error('Unhandled Promise:', error));
process.on('uncaughtException', error => console.error('Uncaught Exception:', error));

client.login(process.env.DISCORD_TOKEN);