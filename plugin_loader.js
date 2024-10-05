const fs = require('fs');
const path = require('path');

/**
 * Class representing a plugin loader.
 */
class PluginLoader {
    /**
     * Creates an instance of PluginLoader.
     * 
     * @param {Object} client - The client object where the plugins will be registered.
     * @param {string} pluginsPath - The path to the plugins directory.
     */
    constructor(client, pluginsPath) {
        /**
         * The client object where plugins will be registered.
         * @type {Object}
         */
        this.client = client;

        /**
         * The path to the plugins directory.
         * @type {string}
         */
        this.pluginsPath = pluginsPath;
    }

    /**
     * Loads all plugins from the specified plugins directory.
     * 
     * The method iterates through each plugin folder, checks for the existence of a `manifest.json` file,
     * and loads events, commands, and slash commands based on the paths specified in the manifest.
     */
    loadPlugins() {
        const pluginFolders = fs.readdirSync(`${process.cwd()}/${this.pluginsPath}`);

        for (const folder of pluginFolders) {
            const pluginPath = path.join(process.cwd(), this.pluginsPath, folder);
            const manifestPath = path.join(pluginPath, 'manifest.json');

            if (!fs.existsSync(manifestPath)) {
                console.warn(`Plugin ${folder} is missing a manifest.json file.`);
                continue;
            }

            const manifest = require(manifestPath);
            console.log(`Loading plugin: ${manifest.name}`);

            // Load events
            if (manifest.eventsPath) {
                const eventsDir = path.join(pluginPath, manifest.eventsPath);
                this.loadEvents(eventsDir);
            }

            // Load commands
            if (manifest.commandsPath) {
                const commandsDir = path.join(pluginPath, manifest.commandsPath);
                this.loadCommands(commandsDir);
            }

            // Load slash commands
            if (manifest.slashCommandsPath) {
                const slashCommandsDir = path.join(pluginPath, manifest.slashCommandsPath);
                this.loadSlashCommands(slashCommandsDir);
            }
        }
    }

    /**
     * Loads events from the specified directory and registers them with the client.
     * 
     * @param {string} eventsDir - The directory containing event files.
     */
    loadEvents(eventsDir) {
        if (!fs.existsSync(eventsDir)) {
            console.warn(`Events directory not found: ${eventsDir}`);
            return;
        }

        const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsDir, file));

            // Check if the event is an instance of the Event class
            if (event instanceof require('./event')) {
                event.register(this.client);
            }
        }
    }

    /**
     * Loads commands from the specified directory and registers them with the client.
     * 
     * @param {string} commandsDir - The directory containing command files.
     */
    loadCommands(commandsDir) {
        if (!fs.existsSync(commandsDir)) {
            console.warn(`Commands directory not found: ${commandsDir}`);
            return;
        }

        const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsDir, file));

            // Check if the command is an instance of the Command class
            if (command instanceof require('./command')) {
                this.client.commands.set(command.name, command);
            }
        }
    }

    /**
     * Loads slash commands from the specified directory and registers them with the client.
     * 
     * @param {string} slashCommandsDir - The directory containing slash command files.
     */
    loadSlashCommands(slashCommandsDir) {
        if (!fs.existsSync(slashCommandsDir)) {
            console.warn(`Slash commands directory not found: ${slashCommandsDir}`);
            return;
        }

        const slashCommandFiles = fs.readdirSync(slashCommandsDir).filter(file => file.endsWith('.js'));

        for (const file of slashCommandFiles) {
            const slashCommand = require(path.join(slashCommandsDir, file));

            // Check if the slash command is an instance of the SlashCommand class
            if (slashCommand instanceof require('./slashCommand')) {
                this.client.slashCommands.set(slashCommand.name, slashCommand);
            }
        }
    }
}

module.exports = PluginLoader;
