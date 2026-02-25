const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all available commands automatically'),
    async execute(interaction) {
        const foldersPath = path.join(__dirname, '../../commands');
        const commandFolders = fs.readdirSync(foldersPath);
        
        const embed = new EmbedBuilder()
            .setTitle('T0P Service | Help Menu')
            .setColor(0x5865F2)
            .setTimestamp();

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            
            if (fs.lstatSync(commandsPath).isDirectory()) {
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'file.js'); // Abaikan file.js dummy
                
                if (commandFiles.length > 0) {
                    const commandList = [];
                    for (const file of commandFiles) {
                        const command = require(path.join(commandsPath, file));
                        if (command.data) {
                            commandList.push(`\`/${command.data.name}\``);
                        }
                    }

                    if (commandList.length > 0) {
                        const categoryName = folder.charAt(0).toUpperCase() + folder.slice(1);
                        embed.addFields({ name: categoryName, value: commandList.join(', ') });
                    }
                }
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};