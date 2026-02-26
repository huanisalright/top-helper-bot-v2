const { EmbedBuilder } = require('discord.js');
const { afkUsers } = require('../commands/utility/afk.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        if (afkUsers.has(message.author.id)) {
            afkUsers.delete(message.author.id);
            
            const welcomeEmbed = new EmbedBuilder()
                .setDescription(`Welcome back **${message.author.displayName}**! Your AFK status has been removed.`)
                .setColor(0x57F287);

            const welcomeMsg = await message.reply({ embeds: [welcomeEmbed] });
            setTimeout(() => welcomeMsg.delete().catch(() => {}), 5000);
        }

        if (message.mentions.members.size > 0) {
            message.mentions.members.forEach((member) => {
                const afkData = afkUsers.get(member.id);
                if (afkData) {
                    const embed = new EmbedBuilder()
                        .setDescription(`**${member.displayName} is currently AFK**\n\n**Reason:** ${afkData.reason}\n**Since:** <t:${Math.floor(afkData.time / 1000)}:R>`)
                        .setColor(0xFF434E);

                    message.reply({ embeds: [embed] })
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete().catch(err => {});
                            }, 15000);
                        });
                }
            });
        }
    },
};