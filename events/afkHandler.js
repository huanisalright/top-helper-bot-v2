const { Events, EmbedBuilder } = require('discord.js');
const { afkUsers } = require('../commands/utility/afk');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        if (afkUsers.has(message.author.id)) {
            const data = afkUsers.get(message.author.id);
            afkUsers.delete(message.author.id);

            try {
                await message.member.setNickname(data.nickname);
            } catch (err) {
            }

            const welcomeBack = new EmbedBuilder()
                .setDescription(`Welcome back ${message.author}! Your AFK status has been removed.`)
                .setColor(0x57F287);

            return message.channel.send({ embeds: [welcomeBack] }).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        }

        if (message.mentions.members.size > 0) {
            message.mentions.members.forEach(member => {
                if (afkUsers.has(member.id)) {
                    const data = afkUsers.get(member.id);
                    const afkEmbed = new EmbedBuilder()
                        .setTitle(`${member.user.username} is AFK`)
                        .setDescription(`**Reason:** ${data.reason}\n**Since:** <t:${Math.floor(data.time / 1000)}:R>`)
                        .setColor(0xED4245);
                    
                    message.reply({ embeds: [afkEmbed] });
                }
            });
        }
    },
};