// https://discord.js.org
import Discord from 'discord.js';

// https://www.npmjs.com/package/jsonfile
import Jsonfile from 'jsonfile';

// https://www.npmjs.com/package/cleverbot-free
import cleverbot from 'cleverbot-free';

import Common from './src/common.js';
// import Commands from './src/commands.js';
import DbModel from './src/dbModel.js';
import config from './src/config.js';

const client = new Discord.Client();
const db = new DbModel('./database/database.json', true, false);

// Initial setup info ---------------------------
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  /**
   * @type {Array.<String>}
   */
  const Guilds = client.guilds.cache.map((guild) => guild.id);

  Guilds.forEach((guildId) => {
    const guild = client.guilds.cache.get(guildId);
    db.setGuildId(guildId);

    console.log('Guild found: ' + guild.name + ' ----------------------');
    console.log(`Using prefix: ${db.prefix}`);

    // // Set channels by id's from config
    // channels = {
    // 	announcements: guild.channels.cache.get(db.announcementsChannelId),
    // 	general: guild.channels.cache.get(db.generalChannelId),
    // 	test: guild.channels.cache.get(db.testChannelId)
    // };

    // // Log channels settings
    // if (!channels.announcements) return console.log("Couldn't get the announcement channel.");
    // else console.log("Announcement channel found: " + channels.announcements.name);

    // if (!channels.announcements) return console.log("Couldn't get the general channel.");
    // else console.log("General channel found: " + channels.general.name);

    // if (!channels.announcements) return console.log("Couldn't get the general channel.");
    // else console.log("Test channel found: " + channels.test.name);
  });
});

client.on('message', (message) => {
  if (message.author.bot) return;

  const isAdmin = message.member.hasPermission('ADMINISTRATOR') ? true : false;
  const messageWords = message.content.split(' ');
  const senderId = message.member.user.id;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    // Command
  } else {
    // Not a command
  }
});

// // Automatic timed messages ---------------------
// client.on('ready', () => {

// 	Common.LoopAction(5000, () => {
// 		let currentTime = new Date();

// 		if (currentTime - db.lastMessageTime > Config.messageInactivityMinutes * 60000) {
// 			message = Common.RandomValue(Config.longInactivityAnswers);
// 			channels.general.send(message);
// 			db.lastMessageTime = new Date();
// 		}
// 	});

// });

// // Update last message time ---------------------
// client.on("message", msg => {
// 	if (msg.content.startsWith(prefix) || msg.author.bot) return;

// 	db.lastMessageTime = new Date();
// 	console.log("⭕ Zaktualizowano datę wysłania ostatniej wiadomości na " + new Date());
// });

// Automatic responses -----------------
// client.on('message', (msg) => {
// 	// Prevent reacting to own messages
// 	if (msg.author.bot) return;

// 	// Prevent null message
// 	if (msg.member === null) return;

// 	// Initial variables
// 	const messageWords = msg.content.split(' ');
// 	const senderId = msg.member.user.id;
// 	const isAdmin = msg.member.hasPermission('ADMINISTRATOR');

// 	// Swearing reaction
// 	messageWords.forEach((element, index, array) => {
// 		if (Config.curses.indexOf(element.toLowerCase()) !== -1) {
// 			let answerMessage;

// 			if (!isAdmin) {
// 				answerMessage = Common.RandomValue(Config.curseAnswers);
// 			} else {
// 				answerMessage = Common.RandomValue(Config.adminCurseAnswers);
// 			}

// 			msg.channel.send(answerMessage);
// 		}
// 	});

// 	// Mention reaction
// 	if (msg.mentions.has(client.user)) {
// 		// Message beautifying
// 		let message = msg.content.replace('<@!' + client.user.id + '>', '');
// 		message.replace(/\s{2,}/g, ' ');
// 		message = message.trim();

// 		// Get chat context
// 		let userId = msg.author.id;
// 		let chatContext = db.getUserChatContext(userId);

// 		cleverbot(message, chatContext).then((response) => {
// 			msg.reply(response);
// 			chatContext.push(message);
// 			chatContext.push(response);
// 			db.setUserChatContext(userId, chatContext);

// 			console.log(
// 				'💬 Użytkownik ' +
// 				msg.author.username +
// 				" napisał do Barvila: '" +
// 				message +
// 				"', a Barvil odpowiedział: '" +
// 				response +
// 				"'"
// 			);
// 			console.log(
// 				'Aktualna historia rozmowy z użytkownikiem ' +
// 				msg.author.username +
// 				': ',
// 				chatContext
// 			);
// 		});
// 	}

// 	// Announcement reaction
// 	if (guild && msg.channel == channels.announcements) {
// 		answerMessage = Common.RandomValue(Config.announcementsAnswers).replace(
// 			'#ping',
// 			'<@' + senderId + '>'
// 		);
// 		channels.general.send(answerMessage);
// 	}
// });

// Error handling -------------------------------
client.on('error', (error) => {
  console.error('There was an error:', error);
});

/** ---------------------------------------------
 * Token should be contained in './token.json'
 * file as normal string, if there is no such
 * file app defaults to heroku global BOT_TOKEN
 * global variable
 --------------------------------------------- */
Jsonfile.readFile('./token.json', function (err, obj) {
  if (err) client.login(process.env.BOT_TOKEN);
  else client.login(obj);
});
