const fs = require('fs');
const path = require('path');

class PluginLoader {
    constructor(client, pluginsPath) {
        this.client = client;
        this.pluginsPath = pluginsPath;
    }

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

    loadEvents(eventsDir) {
        if (!fs.existsSync(eventsDir)) {
            console.warn(`Events directory not found: ${eventsDir}`);
            return;
        }

        const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsDir, file));
            if (event instanceof require('./event')) {
                event.register(this.client);
            }
        }
    }

    loadCommands(commandsDir) {
        if (!fs.existsSync(commandsDir)) {
            console.warn(`Commands directory not found: ${commandsDir}`);
            return;
        }

        const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsDir, file));
            if (command instanceof require('./command')) {
                this.client.commands.set(command.name, command);
            }
        }
    }

    loadSlashCommands(slashCommandsDir) {
        if (!fs.existsSync(slashCommandsDir)) {
            console.warn(`Slash commands directory not found: ${slashCommandsDir}`);
            return;
        }

        const slashCommandFiles = fs.readdirSync(slashCommandsDir).filter(file => file.endsWith('.js'));

        for (const file of slashCommandFiles) {
            const slashCommand = require(path.join(slashCommandsDir, file));
            if (slashCommand instanceof require('./slashCommand')) {
                this.client.slashCommands.set(slashCommand.name, slashCommand);
            }
        }
    }
}

module.exports = PluginLoader;
