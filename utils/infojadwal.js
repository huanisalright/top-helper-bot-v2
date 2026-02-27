const { SlashCommandBuilder } = require('discord.js');
const { jadwalNext } = require('../../utils/embed.js');
const jadwalData = require('../../jadwal_data.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infojadwal')
        .setDescription('Cek satu mata kuliah terdekat yang akan datang'),
    async execute(interaction) {
        const sekarang = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
        const hariSekarang = sekarang.getDay();
        const jamSekarang = `${sekarang.getHours().toString().padStart(2, '0')}:${sekarang.getMinutes().toString().padStart(2, '0')}`;

        const jadwalHariIni = jadwalData
            .filter(m => m.hari === hariSekarang && m.jam > jamSekarang)
            .sort((a, b) => a.jam.localeCompare(b.jam));

        if (jadwalHariIni.length > 0) {
            const embed = jadwalNext(jadwalHariIni[0], 'found');
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = jadwalNext(null, 'none');
            await interaction.reply({ embeds: [embed] });
        }
    }
};