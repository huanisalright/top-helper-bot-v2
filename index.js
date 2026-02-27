const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron'); 
const jadwalKuliah = require('./jadwal_data.js');
const { notif } = require('./utils/embed.js');
require('dotenv').config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] 
});

cron.schedule('* * * * *', () => {
    const sekarang = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const target = new Date(sekarang.getTime() + 60 * 60 * 1000); 
    
    const hari = target.getDay();
    const jamMenit = `${target.getHours().toString().padStart(2, '0')}:${target.getMinutes().toString().padStart(2, '0')}`;

    const matkul = jadwalKuliah.find(k => k.hari === hari && k.jam === jamMenit);

    if (matkul) {
        const channel = client.channels.cache.get('1476454680895819910');
        if (channel) {
            const embed = notif(
                '⚠️ REMINDER KULIAH!', 
                `Satu jam lagi ada kelas **${matkul.matkul}** jam **${matkul.jam}**. Semangat Juan! 🏗️`,
                0xFFFF00
            );
            channel.send({ embeds: [embed] });
        }
    }
});

client.commands = new Collection();

client.login(process.env.DISCORD_TOKEN);