// https://www.npmjs.com/package/node-json-db
import { JsonDB } from 'node-json-db';
import { Config as JDBConfig } from 'node-json-db/dist/lib/JsonDBConfig.js';

// https://discord.js.org
import Discord from 'discord.js';

import config from './config.js';

export default class DBModel {
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
   * Gets string by current locale
   * @param {String} id Name of string member to
   * get in snake case
   * @param {Array} replace Strings to replace
   * arguments with
   * @param {Boolean} lettercase Case of first
   * letter in returned string:
   * - true for Uppercase
   * - false for Lowercase
   * - null for original (default)
   */
  _(id, replace = [], lettercase = null) {
    // Snake case to camel case
    id = id.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

    let string = config.locales[this.locale].strings[id] ?? '?';

    if (string != '?') {
      // Replace "##i" with given strings
      if (replace.length !== 0) {
        for (let i = 0; i < replace.length; i++) {
          const replaceString = replace[i];

          string = string.replace(`##${i}`, replaceString);
        }
      }
      // Transform first letter case
      switch (lettercase) {
        case true:
          id = id.charAt(0).toUpperCase() + id.slice(1);
          break;
        case false:
          id = id.charAt(0).toLowerCase() + id.slice(1);
          break;
      }
    }
    return string;
  }

  /**
   * Set currently used guild id
   * @param {String} guildId
   */
  setCurrentGuildId(guildId) {
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
    return this.get('config/prefix') ?? config.basePrefix;
  }

  /**
   * Set command prefix for current guild
   * @param {String} prefix
   */
  set prefix(prefix) {
    this.set('config/prefix', prefix);
  }

  /**
   * Set used language for current guild
   */
  set locale(lang) {
    this.set('config/locale', lang);
  }

  /**
   * Get used language for current guild
   */
  get locale() {
    let locale = this.get('config/lang') ?? config.baseLocale;
    if (config.locales[locale]) {
      return locale;
    } else {
      console.warn(
        `Locale not found: ${locale}, defaulting to ${config.baseLocale}`
      );
      this.locale = config.baseLocale;
      return config.baseLocale;
    }
  }

  getLocaleString() {
    return config.locales[this.locale].language;
  }

  // set announcementsChannelId(announcementsChannelId) {
  //   this.db.push('config/channels/announcements', announcementsChannelId);
  // }

  // get announcementsChannelId() {
  //   try {
  //     return this.db.getData('config/channels/announcement');
  //   } catch (error) {
  //     return config.channelIds.announcements;
  //   }
  // }

  set welcomeChannelId(welcomeChannelId) {
    this.set('config/channels/welcome', welcomeChannelId);
  }

  get welcomeChannelId() {
    return this.get('config/channels/welcome') ?? null;
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
