const log = require('npmlog');
const discord = require('./discord.js');
const loadSlashCommands = require('./deploy-commands.js');

async function init() {
	try {
		await loadSlashCommands.start();
		discord.start();
	} catch (err) {
		log.error(err);
	}
}
init();