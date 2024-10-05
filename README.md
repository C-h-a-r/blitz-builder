# <img src="https://media.discordapp.net/attachments/1292200136507785261/1292200172876726362/logo.png?ex=6702deb1&is=67018d31&hm=fa85af70768ab8ed23a6829fa5b0939911128eb8f83036f68480087706413ec7&=&format=webp&quality=lossless&width=1025&height=342"/>

<div style="text-align: center;">

<img src="https://media.discordapp.net/attachments/1292200136507785261/1292200172524142823/install.png?ex=6702deb1&is=67018d31&hm=537b028d2acf44f6fb6837cc85913bbfc08153e22671705b83a1ad0284db962d&=&format=webp&quality=lossless">

</div>

<br></br>

BLITZ BUILDER is an NPM package that helps you build modular Discord bots using `discord.js`. The package provides an easy framework to create events, commands, slash commands, all within a plugin-based architecture.

## Features

- **Event, Command, and Slash Command Handling**: Create modular events, commands, and slash commands with ease.
- **Plugin-Based Architecture**: Plugins can be created and loaded dynamically, allowing flexibility in bot design.
- **Configurable**: Central bot configuration and per-plugin configuration support.

---

## Installation

To get started, install the package using NPM:

```bash
npm install @blitz-bots/builder
```

You'll also need `discord.js`:

```bash
npm install discord.js
```

---

## Usage

### 1. **The BLITZ Base Bot Code**

First, you need to create a "base bot" that will load plugins and handle configuration. Here's an example of a basic bot setup.

#### File: `bot.js`

```js
// bot.js (The base bot)
const { Client, Collection, IntentsBitField } = require("discord.js");
const PluginLoader = require("@blitz-bots/builder/plugin_loader");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Load Config File
const config = require("config.json");

client.commands = new Collection();
client.slashCommands = new Collection();

// Load plugins from the plugins folder using the manifest
const pluginLoader = new PluginLoader(client, "./plugins");
pluginLoader.loadPlugins();

// Discord ready event
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Handle command interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (command) await command.run(interaction);
});

// Handle message-based commands
client.on("messageCreate", (message) => {
  const prefix = config.prefix;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (command) {
    command.run(message, args);
  }
});

// Login to Discord
client.login(config.token);
```

---

### 2. **Configuration**

#### File: `config.json`

This file contains the bot's main configuration, such as the Discord token and bot prefix.

```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!"
}
```

- `token`: Your Discord bot's token.
- `prefix`: The command prefix for the bot.

---

### 3. **Plugin Structure**

Each plugin is loaded dynamically and is structured as follows:

```
/plugins
    /plugin_one
        /events
            message.js
        /commands
            ping.js
        /slashCommands
            hello.js
        manifest.json
        config.json (optional)
```

- **`manifest.json`**: Defines where the plugin’s events, commands, and slash commands are located.
- **`config.json` (optional)**: Plugin-specific configuration file.

#### Example `manifest.json` for a Plugin:

```json
{
  "name": "plugin_one",
  "description": "A test plugin for events and commands",
  "eventsPath": "./events",
  "commandsPath": "./commands",
  "slashCommandsPath": "./slashCommands",
  "configFile": "./config.json"
}
```

---

### 4. **Events, Commands, and Slash Commands**

Plugins are responsible for handling their own events, commands, and slash commands. These are dynamically loaded by the base bot.

#### Example Event

In the `/events` folder of your plugin, you can create an event file:

```js
// plugins/plugin_one/events/messageCreate.js
module.exports = {
  name: "messageCreate",
  execute(message, client) {
    console.log(`Message received: ${message.content}`);
  },
};
```

#### Example Command

In the `/commands` folder of your plugin:

```js
// plugins/plugin_one/commands/ping.js
module.exports = {
  name: "ping",
  description: "Replies with Pong!",
  execute(message, args) {
    message.reply("Pong!");
  },
};
```

#### Example Slash Command

In the `/slashCommands` folder of your plugin:

```js
// plugins/plugin_one/slashCommands/hello.js
module.exports = {
  name: "hello",
  description: "Replies with hello!",
  execute(interaction) {
    interaction.reply("Hello!");
  },
};
```

---

## Summary of Classes

<a name="PluginLoader"></a>

## PluginLoader

Class representing a plugin loader.

**Kind**: global class

- [PluginLoader](#PluginLoader)
  - [new PluginLoader(client, pluginsPath)](#new_PluginLoader_new)
  - [.client](#PluginLoader+client) : <code>Object</code>
  - [.pluginsPath](#PluginLoader+pluginsPath) : <code>string</code>
  - [.loadPlugins()](#PluginLoader+loadPlugins)
  - [.loadEvents(eventsDir)](#PluginLoader+loadEvents)
  - [.loadCommands(commandsDir)](#PluginLoader+loadCommands)
  - [.loadSlashCommands(slashCommandsDir)](#PluginLoader+loadSlashCommands)

<a name="new_PluginLoader_new"></a>

### new PluginLoader(client, pluginsPath)

Creates an instance of PluginLoader.

| Param       | Type                | Description                                             |
| ----------- | ------------------- | ------------------------------------------------------- |
| client      | <code>Object</code> | The client object where the plugins will be registered. |
| pluginsPath | <code>string</code> | The path to the plugins directory.                      |

<a name="PluginLoader+client"></a>

### pluginLoader.client : <code>Object</code>

The client object where plugins will be registered.

**Kind**: instance property of [<code>PluginLoader</code>](#PluginLoader)
<a name="PluginLoader+pluginsPath"></a>

### pluginLoader.pluginsPath : <code>string</code>

The path to the plugins directory.

**Kind**: instance property of [<code>PluginLoader</code>](#PluginLoader)
<a name="PluginLoader+loadPlugins"></a>

### pluginLoader.loadPlugins()

and loads events, commands, and slash commands based on the paths specified in the manifest.` file,

**Kind**: instance method of [<code>PluginLoader</code>](#PluginLoader)
<a name="PluginLoader+loadEvents"></a>

### pluginLoader.loadEvents(eventsDir)

Loads events from the specified directory and registers them with the client.

**Kind**: instance method of [<code>PluginLoader</code>](#PluginLoader)

| Param     | Type                | Description                           |
| --------- | ------------------- | ------------------------------------- |
| eventsDir | <code>string</code> | The directory containing event files. |

<a name="PluginLoader+loadCommands"></a>

### pluginLoader.loadCommands(commandsDir)

Loads commands from the specified directory and registers them with the client.

**Kind**: instance method of [<code>PluginLoader</code>](#PluginLoader)

| Param       | Type                | Description                             |
| ----------- | ------------------- | --------------------------------------- |
| commandsDir | <code>string</code> | The directory containing command files. |

<a name="PluginLoader+loadSlashCommands"></a>

### pluginLoader.loadSlashCommands(slashCommandsDir)

Loads slash commands from the specified directory and registers them with the client.

**Kind**: instance method of [<code>PluginLoader</code>](#PluginLoader)

| Param            | Type                | Description                                   |
| ---------------- | ------------------- | --------------------------------------------- |
| slashCommandsDir | <code>string</code> | The directory containing slash command files. |

<br></br>

<a name="Event"></a>

## Event

Class representing an event.

**Kind**: global class

- [Event](#Event)
  - [new Event(name, execute)](#new_Event_new)
  - [.name](#Event+name) : <code>string</code>
  - [.execute](#Event+execute) : <code>function</code>
  - [.register(client)](#Event+register)

<a name="new_Event_new"></a>

### new Event(name, execute)

Creates an instance of Event.

| Param   | Type                  | Description                                              |
| ------- | --------------------- | -------------------------------------------------------- |
| name    | <code>string</code>   | The name of the event (e.g., 'messageCreated', 'ready'). |
| execute | <code>function</code> | The function to be executed when the event is triggered. |

<a name="Event+name"></a>

### event.name : <code>string</code>

The name of the event.

**Kind**: instance property of [<code>Event</code>](#Event)
<a name="Event+execute"></a>

### event.execute : <code>function</code>

The function to execute when the event is triggered.

**Kind**: instance property of [<code>Event</code>](#Event)
<a name="Event+register"></a>

### event.register(client)

Registers the event listener with the client.

**Kind**: instance method of [<code>Event</code>](#Event)

| Param  | Type                | Description                                                         |
| ------ | ------------------- | ------------------------------------------------------------------- |
| client | <code>Object</code> | The client object (a Discord.js client) to register the event with. |

<br></br>

<a name="Command"></a>

## Command

Class representing a command.

**Kind**: global class

- [Command](#Command)
  - [new Command(name, description, execute)](#new_Command_new)
  - [.name](#Command+name) : <code>string</code>
  - [.description](#Command+description) : <code>string</code>
  - [.execute](#Command+execute) : <code>function</code>
  - [.run(message, args)](#Command+run)

<a name="new_Command_new"></a>

### new Command(name, description, execute)

Creates an instance of Command.

| Param       | Type                  | Description                                            |
| ----------- | --------------------- | ------------------------------------------------------ |
| name        | <code>string</code>   | The name of the command.                               |
| description | <code>string</code>   | A brief description of the command.                    |
| execute     | <code>function</code> | The function to execute when the command is triggered. |

<a name="Command+name"></a>

### command.name : <code>string</code>

The name of the command.

**Kind**: instance property of [<code>Command</code>](#Command)
<a name="Command+description"></a>

### command.description : <code>string</code>

The description of the command.

**Kind**: instance property of [<code>Command</code>](#Command)
<a name="Command+execute"></a>

### command.execute : <code>function</code>

The function to execute when the command is triggered.

**Kind**: instance property of [<code>Command</code>](#Command)
<a name="Command+run"></a>

### command.run(message, args)

Executes the command.

**Kind**: instance method of [<code>Command</code>](#Command)

| Param   | Type                              | Description                                                             |
| ------- | --------------------------------- | ----------------------------------------------------------------------- |
| message | <code>Object</code>               | The message object (from Discord.js) containing details of the message. |
| args    | <code>Array.&lt;string&gt;</code> | An array of arguments passed to the command.                            |

<br></br>

<a name="SlashCommand"></a>

## SlashCommand

Class representing a slash command.

**Kind**: global class

- [SlashCommand](#SlashCommand)
  - [new SlashCommand(name, description, [options], execute)](#new_SlashCommand_new)
  - [.name](#SlashCommand+name) : <code>string</code>
  - [.description](#SlashCommand+description) : <code>string</code>
  - [.options](#SlashCommand+options) : <code>Array.&lt;Object&gt;</code>
  - [.execute](#SlashCommand+execute) : <code>function</code>
  - [.run(interaction)](#SlashCommand+run) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.toJSON()](#SlashCommand+toJSON) ⇒ <code>Object</code>

<a name="new_SlashCommand_new"></a>

### new SlashCommand(name, description, [options], execute)

Creates an instance of SlashCommand.

| Param       | Type                              | Default         | Description                                                  |
| ----------- | --------------------------------- | --------------- | ------------------------------------------------------------ |
| name        | <code>string</code>               |                 | The name of the slash command.                               |
| description | <code>string</code>               |                 | A brief description of the slash command.                    |
| [options]   | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | An array of options for the slash command (e.g., arguments). |
| execute     | <code>function</code>             |                 | The function to execute when the slash command is triggered. |

<a name="SlashCommand+name"></a>

### slashCommand.name : <code>string</code>

The name of the slash command.

**Kind**: instance property of [<code>SlashCommand</code>](#SlashCommand)
<a name="SlashCommand+description"></a>

### slashCommand.description : <code>string</code>

The description of the slash command.

**Kind**: instance property of [<code>SlashCommand</code>](#SlashCommand)
<a name="SlashCommand+options"></a>

### slashCommand.options : <code>Array.&lt;Object&gt;</code>

An array of options (arguments) for the slash command.

**Kind**: instance property of [<code>SlashCommand</code>](#SlashCommand)
<a name="SlashCommand+execute"></a>

### slashCommand.execute : <code>function</code>

The function to execute when the slash command is triggered.

**Kind**: instance property of [<code>SlashCommand</code>](#SlashCommand)
<a name="SlashCommand+run"></a>

### slashCommand.run(interaction) ⇒ <code>Promise.&lt;void&gt;</code>

Executes the slash command.

**Kind**: instance method of [<code>SlashCommand</code>](#SlashCommand)
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the command has been executed.

| Param       | Type                | Description                                                        |
| ----------- | ------------------- | ------------------------------------------------------------------ |
| interaction | <code>Object</code> | The interaction object representing the slash command interaction. |

<a name="SlashCommand+toJSON"></a>

### slashCommand.toJSON() ⇒ <code>Object</code>

Converts the slash command to a JSON object.

**Kind**: instance method of [<code>SlashCommand</code>](#SlashCommand)
**Returns**: <code>Object</code> - The JSON representation of the slash command.
