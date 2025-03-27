const fs = require('fs');
const path = require('path');
const log = require('npmlog');
const _ = require('underscore');
var ffmpeg = require('fluent-ffmpeg');
const {google} = require('googleapis');
const config = require('./config.js');
let timeoutTimer = null;

async function createNewRecording() {
	if (!fs.existsSync('./recordings')) {
		await fs.mkdirSync('./recordings');
	};
	const newFileName = await getNewFileName();
	const pathToFile = __dirname + '/recordings/' + newFileName + '.pcm';
	return module.exports.writeStream = fs.createWriteStream(pathToFile);
};

function getUserVolume(userID) {
    const user = config.userSpecificVolumeAdjustments.find(u => u.userID === userID);
    return user ? user.volume : 100;
}

function getNewFileName() {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const yyyy = today.getFullYear();

	const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	const day = weekday[today.getDay()];

	return mm + '_' + dd + '_' + yyyy + '_' + day + '_' + Date.now();
};

async function convertFile(input, output, callback) {
	const fileToConvert = path.join(__dirname, 'recordings') + '/' + input;
	const fileToMake = path.join(__dirname, 'recordings') + '/' + output;
	let volumeToUse = 1;
	if (config.globalVolume !== 100) {
		volumeToUse = config.globalVolume / 100;
	}
	await ffmpeg(fileToConvert).inputOptions('-f','s16le','-ar','48000','-ac','2').audioFilters('volume=' + volumeToUse).output(fileToMake).on('end', function() {
		callback(null);
	}).on('error', function(err){
		callback(err);
	}).run();
};

function getMostRecentRecording(dir) {
	const files = fs.readdirSync(dir);
	return _.max(files, function (f) {
		const fullpath = path.join(dir, f);
		return fs.statSync(fullpath).ctime;
	});
};

async function startTimeoutTimer(interaction) {
	timeoutTimer = await setInterval(checkNumberOfVoiceMembers, 3000, interaction);
}

async function stopTimeoutTimer() {
	clearInterval(timeoutTimer);
}

async function checkNumberOfVoiceMembers(interaction) {
	const voiceChannel = await interaction.guild.channels.fetch(interaction.options.getChannel('channel').id, { force: true });
 	if (voiceChannel.members?.size === 1) {
 		log.info('Detected no users in the channel during recording, stopping automatically');
 		await interaction.client.commands.get('stop').execute(interaction);
 	}
}

async function createGoogleDriveClient() {
	log.info('Creating Google Drive client');
	const client = await new google.auth.OAuth2(config.googleDriveClientID, config.googleDriveClientSecret, config.googleDriveRedirectURI);
	client.setCredentials({ refresh_token: config.googleDriveRefreshToken });

	return google.drive({
		version: 'v3',
		auth: client,
	});
}

async function uploadFileToGoogleDrive(driveClient, fileName) {
	try {
		log.info('Starting upload to Google Drive');
		const response = await driveClient.files.create({
			requestBody: {
				name: fileName,
				mimeType: 'audio/mpeg',
				parents: [config.googleDriveFolderID]
			},
			media: {
				mimeType: 'audio/mpeg',
				body: fs.createReadStream('recordings/' + fileName),
			},
		});
		log.info('Finished uploading to Google Drive');
		return response.data.id;
	}catch (error) {
		log.error(error.message);
	}
}

async function getPublicGoogleDriveFileLink(driveClient, fileID) {
	log.info('Getting public Google Drive link');
	try {
		// Change file permissions to public
		await driveClient.permissions.create({
			fileId: fileID,
			requestBody: {
				role: 'reader',
				type: 'anyone',
			},
		});

		// Get the new public web view link
		const result = await driveClient.files.get({
			fileId: fileID,
			fields: 'webViewLink',
		});
		return result.data.webViewLink;
	} catch (error) {
		log.error(error.message);
	}
}

async function deleteOldRecordings() {
	if (config.autoDeleteRecordingsAfterUpload) {
		// Clear the files in the recordings folder
		fs.readdir('./recordings/', (err, files) => {
			if (err) throw err;
			for (const file of files) {
				fs.unlink(path.join('./recordings/', file), (err) => {
					if (err) throw err;
				});
			}
		});
	}
}

module.exports = {
	createNewRecording,
	convertFile,
	getMostRecentRecording,
	startTimeoutTimer,
	stopTimeoutTimer,
	createGoogleDriveClient,
	uploadFileToGoogleDrive,
	getPublicGoogleDriveFileLink,
	deleteOldRecordings,
	getUserVolume
};