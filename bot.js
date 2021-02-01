// https://discord.js.org
import Discord from 'discord.js';

// https://www.npmjs.com/package/read-file
import readFile from 'read-file';

// https://www.npmjs.com/package/jsonfile
import Jsonfile from 'jsonfile';

import Commands from './src/commands.js';
import DBModel from './src/db-model.js';
import config from './src/config.js';
import Behaviour from './src/behaviour.js';

const isProduction = process.env.BOT_TOKEN == true;
const client = new Discord.Client();
const db = new DBModel('./database/database.json', true, false);
const commands = new Commands(client, db);
const behaviour = new Behaviour(client, db);

// Initial setup info ---------------------------
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  /**
   * @type {Array.<String>}
   */
  const Guilds = client.guilds.cache.map((guild) => guild.id);

  Guilds.forEach((guildId) => {
    const guild = client.guilds.cache.get(guildId);
    db.setCurrentGuildId(guildId);

    console.log('Guild found: ' + guild.name);
    console.log(`| Using prefix: ${db.prefix}`);
    console.log(`| Using language: ${db.getLocaleString()}`);

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
  // Prevent reacting to own messages
  if (message.author.bot) return;

  const messageWords = message.content.split(' ');
  const senderId = message.member.user.id;
  const args = message.content.slice(db.prefix.length).trim().split(' ');

  if (message.content.startsWith(db.prefix)) {
    commands.message = message;
    commands.invokeCommand();
    return;
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

// Node error handling
if (isProduction)
  process.on('uncaughtException', function (err) {
    console.error('Caught exception: ', err);
    console.error('Error stack: ', err.stack);
  });

/** ---------------------------------------------
 * Token should be contained in './private.json'
 * file as "token" property, if there is no such
 * file app defaults to heroku global BOT_TOKEN
 * global variable
 --------------------------------------------- */
Jsonfile.readFile('./private.json', function (err, obj) {
  if (err) client.login(process.env.BOT_TOKEN);
  else client.login(obj.TOKEN);
});
