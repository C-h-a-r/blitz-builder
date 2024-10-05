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

### 1. **PluginLoader**

The `PluginLoader` is responsible for loading all the plugins and their components (events, commands, and slash commands) dynamically based on the structure defined in each plugin's manifest.

---
