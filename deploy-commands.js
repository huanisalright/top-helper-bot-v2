const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const commandNames = new Set();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log('--- Loading Commands ---');

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    
    if (!fs.lstatSync(commandsPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            const cmdName = command.data.name;

            if (commandNames.has(cmdName)) {
                console.error(`\x1b[31m[ERROR]\x1b[0m Duplicate command name found: "${cmdName}"`);
                console.error(`Location: ${filePath}`);
                console.error('Please check your setName() in each file. Deployment cancelled.');
                process.exit(1);
            }

            commandNames.add(cmdName);
            commands.push(command.data.toJSON());
            console.log(`Successfully loaded: ${folder}/${file} (/${cmdName})`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`\nStarted refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`\x1b[32mSuccessfully reloaded ${data.length} application (/) commands.\x1b[0m`);
    } catch (error) {
        console.error('\x1b[31mDeployment Error:\x1b[0m');
        console.error(error);
    }
})();