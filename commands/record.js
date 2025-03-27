const log = require('npmlog');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, EndBehaviorType } = require('@discordjs/voice');
const { opus } = require('prism-media');
const audioMixer = require('audio-mixer');
const util = require('../util.js');
const config = require('../config.js');

module.exports = {
	data: new SlashCommandBuilder().setName('record').setDescription('Start a recording!').addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel you want to record.')
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildVoice)
	),
	async execute(interaction) {
		// Join the passed in voice channel
		const connection = await joinVoiceChannel({
			channelId: interaction.options.getChannel('channel').id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false
		});

		util.startTimeoutTimer(interaction);

		// Create a new `audio mixer`
		const mixer = new audioMixer.Mixer({
			channels: 2,
			bitDepth: 16,
			sampleRate: 48000,
			clearInterval: 250,
			volume: 100
		});

		// Pipe all of the `mixer` audio directly into a new recording
		const newRecording = await util.createNewRecording();
		mixer.pipe(newRecording);
		await interaction.reply({ content: 'Now recording in #' + interaction.options.getChannel('channel').name + '!', ephemeral: true});
		log.info('Started Recording');

		connection.receiver.speaking.on('start', async (userId) => {
			const fetchedGuildUser = await interaction.guild.members.fetch(userId, { force: true });
			const userNameOfSpeaker = fetchedGuildUser.user.username;
			log.info(userNameOfSpeaker + ' started speaking');

			// Check if we are already subscribed to a user
			if (!connection.receiver.subscriptions.get(userId)) {
				log.info('Adding new subscription for ' + userNameOfSpeaker + ' started speaking');
				// Subscribe to a user's audio feed when they start talking
				const audioStream = connection.receiver.subscribe(userId, {
					end: {
						behavior: 'manual'
					},
				});

				// Create an opus decoder and pipe the user's audioStream into that
				const decoder = new opus.Decoder({ frameSize: 960, channels: 2, rate: 48000 });
				const rawAudio = await audioStream.pipe(decoder);

				// create a new `mixer input` for this new user audioStream
				let input = mixer.input({
					channels: 2,
					volume: util.getUserVolume(userId), //will return 100 if not defined in config
					sampleRate: 48000,
					bitDepth: 16,
					clearInterval: 250
				});

				// Pipe the decoded audioStream into this new `mixer input`
				rawAudio.pipe(input);
			} else {
				log.info('Subscription already exists for ' + userNameOfSpeaker);
			}
		});
		return connection;
	},
};