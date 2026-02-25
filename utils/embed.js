const { EmbedBuilder } = require('discord.js');

const createEmbed = (title, description, color = 0x2b2d31) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
};

module.exports = { createEmbed };