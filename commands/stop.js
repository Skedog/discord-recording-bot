const log = require('npmlog');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const util = require('../util.js');
const config = require('../config.js');

module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('stop recording!'),
	async execute(interaction) {

		const currentVoiceChannel = await getVoiceConnection(interaction.guild.id);

		if (currentVoiceChannel) {

			// Stop the current write stream to close the file
			util.writeStream.destroy();

			// We are leaving the channel, no need for the timeoutTimer now
			await util.stopTimeoutTimer();

			// Leave the current voice channel
			currentVoiceChannel.destroy();
			log.info('Stopped Recording');

			// Prevent double `reply` calls if auto-stopping recording
			if (!interaction.replied) {
				await interaction.reply({content: 'Stopped recording!', ephemeral: true});
			}

			// Get the most recent recording
			const mostRecentRecording = await util.getMostRecentRecording('./recordings/');
			try {
				// Try to convert the recording to a .mp3
				await util.convertFile(mostRecentRecording, mostRecentRecording.replace('.pcm','.mp3'), async function(err){
					if (err) {
						log.error(err);
						interaction.channel.send({content:'An error occurred processing the recording!'});
						return;
					}
					// Success, post the new .mp3 to the Discord channel
					log.info('Conversion Complete');
					const convertedFileName = mostRecentRecording.replace(/\.[^/.]+$/, "") + '.mp3';

					if (config.useGoogleDrive) {
						// Start all of the Google Drive work
						const googleDriveClient = await util.createGoogleDriveClient();
						const uploadedFileID = await util.uploadFileToGoogleDrive(googleDriveClient, convertedFileName);
						const publicGoogleDriveLink = await util.getPublicGoogleDriveFileLink(googleDriveClient, uploadedFileID);

						// Create Discord Embed
						const newFileEmbed = new EmbedBuilder()
							.setColor('#62c5e1')
							.setTitle('New Recording Available')
							.setURL(publicGoogleDriveLink)
							.setDescription('A [new meeting recording](' + publicGoogleDriveLink + ') is available now!')
							.setTimestamp()
							.setFooter({
								text: config.botDisplayName,
								icon_url: config.botIconURL
							});

						// Send the final embed with the recording link
						interaction.channel.send({embeds: [newFileEmbed]});
					} else {
						// By default, bots are limited to 8mb file uploads
						interaction.channel.send({content: 'New recording available!', files: ['./recordings/' + mostRecentRecording.replace(/\.[^/.]+$/, "") + '.mp3'] });
					}
					// If enabled, delete the local recordings
					util.deleteOldRecordings();
				});
			} catch (e) {
				log.error(e);
			}
		} else {
			await interaction.reply({content: 'I am not recording!', ephemeral: true});
		}
	},
};