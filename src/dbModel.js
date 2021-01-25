// https://www.npmjs.com/package/node-json-db
import { JsonDB } from 'node-json-db';
import { Config as JDBConfig } from 'node-json-db/dist/lib/JsonDBConfig.js';

// https://discord.js.org
import Discord from 'discord.js';

import Common from './common.js';
import config from './config.js';

export default class dbModel {
  /**
   * @type {String}
   */
  #guildId;
  /**
   * @type {JsonDB}
   */
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

  /**
   * Set currently used guild id
   * @param {String} guildId
   */
  setGuildId(guildId) {
    this.#guildId = guildId;
  }

  /**
   * Get data from database based on current
   * Guild Id
   * @param {String} path
   */
  get(path) {
    try {
      return this.#db.getData(`${this.#guildId}/${path}`);
    } catch (error) {
      return null;
    }
  }

  /**
   * Set data to database based on current
   * Guild Id
   * @param {String} path
   */
  set(path, data) {
    this.#db.push(`${this.#guildId}/${path}`, data);
  }

  /**
   * Get command prefix for current guild
   * defaults to prefix from config
   * @returns {String}
   */
  get prefix() {
    return this.get('/config/prefix') ?? config.basePrefix;
  }

  /**
   * Set command prefix for current guild
   */
  set prefix(prefix) {
    this.set('config/prefix', prefix);
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
