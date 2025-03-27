# discord-recording-bot
A self-hosted Discord bot that uses slash commands to record voice chats!

### Commands
* /record #voice-channel - start a recording
* /stop - stop the recording and auto-generate a .mp3 file

### Dependencies
* FFMPEG: https://www.ffmpeg.org/ (if on Windows, ensure that FFMPEG is in your PATH)
* NodeJS: https://nodejs.org/

### Setup
* Clone the project: `git clone https://github.com/Skedog/discord-recording-bot`
* Go into the directory: `cd discord-recording-bot`
* Rename `config.example.js` to `config.js`
* Edit the `config.js` file with the correct [Config Options](#config-options)
* Create an application on the Discord Developer Site: https://discord.com/developers/applications
  * Under the `Bot` section ensure under `Privileged Gateway Intents` all 3 options are enabled (https://i.imgur.com/BcWOc2r.png)
    * Presence Intent
	* Server Members Intent
	* Message Content Intent
  * Go to the OAuth2 section and copy the following info into `config.js`
  	* `Client ID` -> `botUserID`
  	* `Client Secret` -> `discordAPIKey`
  * Scroll down and check the `bot` box under Scopes
    * Scroll down under `Bot Permissions` and set the following permissions (https://i.imgur.com/a0JLJeH.png)
	  * Change Nickname
	  * View Channels
	  * Send Messages
	  * Manage Messages
	  * Embed Links
	  * Attach Files
	  * Read Message History
	  * Use Slash Commands
	  * Connect
	  * Speak
  * Scroll down and copy the `Generated URL` and then open that in your browser to add your newly created bot to your Discord server

### Start the bot
  * Run `npm i` to install all required packages
  * Run `node app.js` to start the bot

### Config Options
* **discordAPIKey** <string> // This is your `Client Secret` from the Discord Developer Site
* **botUserID** <string> // This is your `Client ID` from the Discord Developer Site
* **botDisplayName** <string> // Name you want the bot to show as in your server
* **botIconURL** <string> // Bot's profile picture
* **autoDeleteRecordingsAfterUpload** <bool> // Should the locally stored recordings be deleted automatically after upload
* **globalVolume** <number> // Can increase or decrease this to adjust the entire recording volume, defaults to 100
* **userSpecificVolumeAdjustments** <array> // Can adjust volume level for individual users if they are too loud/quiet
* **useS3Bucket** <bool> // Should the bot attempt to upload to an S3 Bucket
* **S3Endpoint** <string> // S3 Bucket endpoint, such as `https://s3.wasabisys.com`
* **S3Region**  <string> // S3 Bucket region, such as `us-east-1`
* **S3BucketName** <string> // S3 Bucket name, such as `recordings`
* **S3AccessKey** <string> // S3 Bucket Access Key
* **S3SecretKey** <string> // S3 Bucket Secret Key
* **useGoogleDrive** <bool> // Should the bot attempt to upload to Google Drive instead of uploading the recording to the Discord Channel
* **googleDriveClientID** <string> // ClientID for Google Drive application
* **googleDriveClientSecret** <string> // Client Secret for Google Drive application
* **googleDriveRefreshToken** <string> // RefreshToken for Google Drive application
* **googleDriveFolderID** <string> // FolderID for Google Drive folder where recordings should be uploaded