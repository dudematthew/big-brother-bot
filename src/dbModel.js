// https://www.npmjs.com/package/node-json-db
import { JsonDB } from 'node-json-db';
import { Config as JDBConfig } from 'node-json-db/dist/lib/JsonDBConfig.js';

// https://discord.js.org
import Discord from 'discord.js';

import Common from './common.js';
import config from './config.js';

export default class dbModel {
  #guildId;
  #db;

  /**
   * @param {string} dbName
   * @param {boolean} saveOnPush
   * @param {boolean} humanReadable
   */
  constructor(dbName, saveOnPush, humanReadable) {
    this.#db = new JsonDB(
      new JDBConfig(dbName, saveOnPush, humanReadable, '/')
    );
  }

  #push() {}

  /**
   * Set currently used guild id
   * @param {String} guildId
   */
  setGuildId(guildId) {
    this.#guildId = guildId;
  }

  /**
   * Get command prefix for current guild
   * defaults to prefix from config
   * @returns {String}
   */
  get prefix() {
    try {
      return this.db.getData(`${this.#guildId}/config/prefix`);
    } catch (error) {
      return config.basePrefix;
    }
  }

  /**
   * Set command prefix for current guild
   */
  set prefix(prefix) {
    this.#db.push(`${this.#guildId}/config/prefix`, prefix);
  }

  //   get announcementsChannelId() {
  //     try {
  //       return this.db.getData('config/channels/announcement');
  //     } catch (error) {
  //       return config.channelIds.announcements;
  //     }
  //   }

  //   set announcementsChannelId(announcementsChannelId) {
  //     this.db.push('config/channels/announcements', announcementsChannelId);
  //   }

  //   get announcementsChannelId() {
  //     try {
  //       return this.db.getData('config/channels/announcement');
  //     } catch (error) {
  //       return config.channelIds.announcements;
  //     }
  //   }

  //   set announcementsChannelId(announcementsChannelId) {
  //     this.db.push('config/channels/announcements', announcementsChannelId);
  //   }
}
