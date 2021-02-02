// https://discord.js.org
import Discord from 'discord.js';

// https://www.npmjs.com/package/read-file
import readFile from 'read-file';

// https://www.npmjs.com/package/node-html-to-image#simple-example
import nodeHtmlToImage from 'node-html-to-image';

// https://www.npmjs.com/package/request
import request from 'request';

// https://www.npmjs.com/package/jsonfile
import Jsonfile from 'jsonfile';

import DBModel from './db-model.js';
import config from './config.js';
import { randomValue } from './common.js';
import { getBasicEmbed } from './common.js';

/**
 * @param {Discord.Client} Client
 * @param {DBModel} db
 */
export default class Behaviour {
  /**
   * @type {DBModel}
   */
  #db;
  /**
   * @type {Discord.Client}
   */
  #client;
  /**
   * @type {Array<String>}
   */

  constructor(client, db) {
    this.#db = db;
    this.#client = client;

    this.#joinMessage();
  }

  #joinMessage() {
    this.#client.on('guildMemberAdd', (member) => {
      this.#db.setCurrentGuildId(member.guild.id);
      let welcomeChannelId = this.#db.welcomeChannelId;

      // welcome channel id is set
      if (welcomeChannelId != null) {
        let welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        // Channel exists
        if (welcomeChannel) {
          /**
           * Get html welcome template
           * @type {String}
           */
          let htmlCode = readFile.sync(
            'src/assets/welcome-message.html',
            'utf8'
          );

          // Replace variables in HTML code
          htmlCode = htmlCode.replace('${imageUrl}', member.user.avatarURL());
          htmlCode = htmlCode.replace('${logoUrl}', config.images.bot);
          htmlCode = htmlCode.replace('${userTag}', member.user.tag);
          htmlCode = htmlCode.replace('${user}', member.user.username);
          htmlCode = htmlCode.replace(
            '${textContent}',
            randomValue(config.locales[this.#db.locale].welcomeStrings)
          );

          // Define your HTML/CSS
          const data = {
            html: htmlCode,
            google_fonts: 'Roboto',
          };

          /** ---------------------------------------------
           * API keys should be contained in './private.json'
           * file as "HTCI_API_ID" & "HTCI_API_KEY" properties,
           * if there are no such, app defaults to heroku global 
           * HTCI_API_KEY & HTCI_API_ID global variables
          --------------------------------------------- */
          Jsonfile.readFile('./private.json', function (err, obj) {
            let API_KEY, API_ID;

            // Retrieve your api_id and api_key
            // from the Dashboard. 
            // https://htmlcsstoimage.com/dashboard
            if (err) {
              API_KEY = process.env.HTCI_API_KEY;
              API_ID = process.env.HTCI_API_ID;
            } else {
              API_KEY = obj.HTCI_API_KEY ?? process.env.HTCI_API_KEY;
              API_ID = obj.HTCI_API_ID ?? process.env.HTCI_API_ID;
            }

            // Create an image by sending 
            // a POST to the API.
            request
              .post({ url: 'https://hcti.io/v1/image', form: data })
              .auth(API_ID, API_KEY)
              .on('data', function (data) {
                let imgLink = JSON.parse(data).url;
                // Send welcome image to welcome
                // channel
                welcomeChannel.send({
                  files: [`${imgLink}.png`],
                });
              });
          });
        }
      } else
        console.log(
          `ID of welcome channel is not set for guild ${member.guild.name}, welcome message will not be send.`
        );
    });
  }
}
