const fs = require('node:fs');
const path = require('node:path');
const log = require('npmlog');
const { REST, Routes } = require('discord.js');
const config = require('./config.js');

async function start() {
	const commands = [];
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	log.info("Loading slash commands");
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({version: '10'}).setToken(config.discordAPIKey);

	log.info("Registering public commands");
	await rest.put(Routes.applicationCommands(config.botUserID), { body: commands })
		.then(() => log.info('Successfully registered commands'))
		.catch(log.error);
}

module.exports = {
	start
};