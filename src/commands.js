// https://discord.js.org
import Discord from 'discord.js';

import DBModel from './db-model.js';
import config from './config.js';

/**
 * @param {Discord.Client} Client
 * @param {DBModel} db
 */
export default class Commands {
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
  #args;
  /**
   * @type {String}
   */
  #isAdmin;
  /**
   * @type {Discord.Message}
   */
  #msg;
  /**
   * @type {String}
   */
  #command;

  constructor(client, db) {
    this.#db = db;
    this.#client = client;
  }

  /**
   * Check if given command exist and returns it's config
   * @param {String} commandString Config command name string
   * @param {String} command Invoked command
   */
  #checkCommand() {
    for (const property in config.locales[this.#db.locale].commands) {
      let configCommand = config.locales[this.#db.locale].commands[property];
      if (
        this.#command == configCommand.commandString ||
        configCommand.aliases.includes(this.#command)
      ) {
        return configCommand.id;
      }
      return false;
    }
  }

  /**
   *
   */
  invokeCommand() {
    let commandId = this.#checkCommand();

    switch (commandId) {
      case 'setprefix':
        this.setPrefix();
        break;
      case 'help':
        this.help();
        break;
    }
  }

  /**
   * @param {Discord.Message} message
   */
  set message(message) {
    this.#msg = message;

    this.#args = message.content
      .slice(this.#db.prefix.length)
      .trim()
      .split(' ');

    this.#command = this.#args.shift().toLowerCase();

    this.#args.shift();

    this.#db.setGuildId(message.guild.id);

    this.#isAdmin = message.member.hasPermission('ADMINISTRATOR')
      ? true
      : false;
  }

  /**
   * Returns currently referenced Discord message
   * @return {Discord.Message}
   */
  get message() {
    return this.#msg;
  }

  /**
   * Help command
   */
  help() {
    // Create Embed
    const helpEmbed = new Discord.MessageEmbed()
      .setColor(config.themeColorHex)
      .setAuthor(this.#db._('name'), config.images.bot)
      .setFooter(this.#db._('help_additional_info', [this.#db.prefix]));

    // There are arguments
    if (this.#args[0]) {
      // Get command based on argument
      let invokedCommand = false;
      for (const property in config.locales[this.#db.locale].commands) {
        const configCommand =
          config.locales[this.#db.locale].commands[property];

        if (
          this.#args[0] == configCommand.commandString ||
          configCommand.aliases.includes(this.#args[0])
        )
          invokedCommand = configCommand;
      }

      helpEmbed.setTitle(
        `Pomoc dla komendy \`${invokedCommand.commandString}\``
      );

      // Command doesn't exist
      if (!invokedCommand) {
        this.help();
        return;
      }

      // Create available aliases string
      let aliasesString = '`';
      if (invokedCommand.aliases.length > 0) {
        invokedCommand.aliases.forEach((element, index) => {
          if (invokedCommand.aliases.length == index + 1)
            aliasesString += element;
          else aliasesString += element + ' ';
        });
        aliasesString += '`';
      } else aliasesString = '';

      // Build embed
      if (aliasesString != '')
        helpEmbed.addField('Alias', aliasesString, false);
      helpEmbed.addField('Opis', invokedCommand.description, false);
      if (invokedCommand.additionalInfo != '')
        helpEmbed.addField('Informacje', invokedCommand.additionalInfo, false);
      helpEmbed.addField(
        'Sposób użycia',
        this.#db.prefix + invokedCommand.useMethod,
        false
      );
    } else {
      helpEmbed.setTitle(this.#db._('help'));

      // Loop config commands
      for (const property in config.locales[this.#db.locale].commands) {
        const configCommand =
          config.locales[this.#db.locale].commands[property];

        let aliasesString = 'Alias: `';
        if (configCommand.aliases.length > 0) {
          configCommand.aliases.forEach((element, index) => {
            if (configCommand.aliases.length == index + 1)
              aliasesString += element;
            else aliasesString += element + ' ';
          });
          aliasesString += '`\n';
        } else aliasesString = '';

        helpEmbed.addField(
          this.#db.prefix + configCommand.commandString,

          aliasesString + 'Opis: ' + configCommand.description + '\n',
          'Sposób użycia: ' + this.#db.prefix + configCommand.useMethod,

          false
        );
      }
    }
    // Send Embed
    this.#msg.channel.send(helpEmbed);
  }

  setPrefix() {
    let _ = this.#db._;
    if (this.#args[0] && !this.#args[1]) {
    } else {
      let helpEmbed = new Discord.MessageEmbed()
        .setColor(config.themeColorHex)
        .addField(
          'Prefix nie może zawierać spacji',
          this.#db.prefix +
            config.locales[this.#db.locale].commands.setPrefix.useMethod,
          false
        );

      this.#msg.channel.send(helpEmbed);
    }
  }

  setChannel() {
    if (this.#args[0] && this.#args[1] && !this.#args[2]) {
      if (
        this.#args[0] == 'test' ||
        this.#args[0] == 'announcements' ||
        this.#args[0] == 'general'
      ) {
        let channel = this.#msg.guild.channels.cache.get(this.#args[1]);
        if (channel !== undefined) {
          switch (this.#args[0]) {
            case 'announcements':
              this.#db.announcementChannelId = this.#args[1];
              this.#msg.channel.send(
                'Ustawiono kanał `' + channel.name + '` na kanał ogłoszeniowy'
              );
              break;

            case 'general':
              this.#db.generalChannelId = this.#args[1];
              this.#msg.channel.send(
                'Ustawiono kanał `' + channel.name + '` na kanał ogólny'
              );
              break;

            case 'test':
              this.#db.testChannelId = this.#args[1];
              this.#msg.channel.send(
                'Ustawiono kanał `' + channel.name + '` na kanał testowy'
              );
              break;

            default:
              break;
          }
        } else this.#msg.channel.send('Nie ma takiego kanału...');
      } else {
        let helpEmbed = new Discord.MessageEmbed()
          .setColor('#ffffff')
          .addField(
            'Emmm... takiego kanału się nie ustawia...',
            config.locales[this.#db.locale].commands.setChannel.additionalInfo,
            false
          );

        this.#msg.channel.send(helpEmbed);
      }
    } else {
      let helpEmbed = new Discord.MessageEmbed()
        .setColor('#ffffff')
        .addField(
          'Poprawne użycie komendy:',
          this.#db.prefix +
            config.locales[this.#db.locale].commands.setChannel.useMethod,
          false
        );

      this.#msg.channel.send(helpEmbed);
    }
  }

  channelType() {
    let testchannel = (channelId) => {
      let foundChannel = false;
      for (const property in config.channelIds) {
        let currentChannelId = config.channelIds[property];

        if (currentChannelId == channelId) {
          foundChannel = property;
        }
      }

      if (foundChannel) {
        this.#msg.channel.send(
          'Ten kanał jest zapisany w mojej bazie jako kanał typu `' +
            foundChannel +
            '`'
        );
      } else {
        this.#msg.channel.send('Ten kanał nie istnieje w mojej bazie...');
      }
    };

    if (this.#args[0] && !this.#args[1]) {
      if (this.#msg.guild.channels.cache.get(this.#args[0]) !== undefined) {
        testchannel(this.#args[0]);
      } else this.#msg.channel.send('Eee... nie ma takiego kanału...');
    } else if (!this.#args[0]) {
      testchannel(this.#msg.channel.id);
    } else {
      let helpEmbed = new Discord.MessageEmbed()
        .setColor('#ffffff')
        .addField(
          'Poprawne użycie komendy:',
          config.locales[this.#db.locale].commands.channelType.useMethod,
          false
        );

      this.#msg.channel.send(helpEmbed);
    }
  }
}