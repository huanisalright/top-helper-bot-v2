const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jadwalKuliah = require('../../jadwal_data.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jadwal')
        .setDescription('Cek seluruh jadwal kuliah mingguan'),
    async execute(interaction) {
        const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const embed = new EmbedBuilder()
            .setTitle('📅 Jadwal Kuliah Rebil')
            .setColor(0x00AE86)
            .setTimestamp();

        let deskripsi = "";
        [1, 2, 3, 4, 5].forEach(h => {
            const list = jadwalKuliah.filter(k => k.hari === h);
            if (list.length > 0) {
                deskripsi += `\n**${namaHari[h]}**\n`;
                list.forEach(k => deskripsi += `• \`${k.jam}\` - ${k.matkul}\n`);
            }
        });

        embed.setDescription(deskripsi || "Belum ada jadwal.");
        await interaction.reply({ embeds: [embed] });
    },
};