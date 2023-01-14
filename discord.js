const fs = require('node:fs');
const path = require('node:path');
const log = require('npmlog');
const { Discord, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require('./config.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

async function start() {
	await setupCommands();
	await monitorForCommands();
	await connect();
}

async function setupCommands() {
	// Read all files from the `commands` directory and add them to the commands collection
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			log.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	log.info('Setup commands complete');
}

async function connect() {
	client.login(config.discordAPIKey);
	client.on('ready', () => {
		log.info('Now monitoring Discord chat');
	});
}

async function monitorForCommands() {
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			log.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error);
			log.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	});
	log.info('Monitor for commands complete');
}

module.exports = {
	start
};