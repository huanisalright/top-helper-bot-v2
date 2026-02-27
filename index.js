import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import cron from 'node-cron';
import jadwalKuliah from './jadwal_data.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ] 
});

cron.schedule('* * * * *', () => {
    const sekarang = new Date();
    const satuJamLagi = new Date(sekarang.getTime() + 60 * 60 * 1000);
    
    const hariSekarang = satuJamLagi.getDay(); 
    const jamMenit = `${satuJamLagi.getHours().toString().padStart(2, '0')}:${satuJamLagi.getMinutes().toString().padStart(2, '0')}`;

    const matkulSkrg = jadwalKuliah.find(k => k.hari === hariSekarang && k.jam === jamMenit);

    if (matkulSkrg) {
        const channel = client.channels.cache.get('1476454680895819910'); 
        if (channel) {
            channel.send(`⚠️ **REMINDER KULIAH!**\nSatu jam lagi ada kelas **${matkulSkrg.matkul}** jam **${matkulSkrg.jam}**.\nPersiapkan diri kamu, Juan! 🏗️`);
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
            const command = await import(`file://${filePath}`);
            if ('data' in command.default && 'execute' in command.default) {
                client.commands.set(command.default.data.name, command.default);
            }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    if (event.default.once) {
        client.once(event.default.name, (...args) => event.default.execute(...args));
    } else {
        client.on(event.default.name, (...args) => event.default.execute(...args));
    }
}

process.on('unhandledRejection', error => console.error('Unhandled Promise:', error));
process.on('uncaughtException', error => console.error('Uncaught Exception:', error));

client.login(process.env.DISCORD_TOKEN);