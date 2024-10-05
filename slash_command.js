/**
 * Class representing a slash command.
 */
class SlashCommand {
    /**
     * Creates an instance of SlashCommand.
     * 
     * @param {string} name - The name of the slash command.
     * @param {string} description - A brief description of the slash command.
     * @param {Array<Object>} [options=[]] - An array of options for the slash command (e.g., arguments).
     * @param {Function} execute - The function to execute when the slash command is triggered.
     */
    constructor(name, description, options, execute) {
        /**
         * The name of the slash command.
         * @type {string}
         */
        this.name = name;

        /**
         * The description of the slash command.
         * @type {string}
         */
        this.description = description;

        /**
         * An array of options (arguments) for the slash command.
         * @type {Array<Object>}
         */
        this.options = options || [];

        /**
         * The function to execute when the slash command is triggered.
         * @type {Function}
         */
        this.execute = execute;
    }

    /**
     * Executes the slash command.
     * 
     * @param {Object} interaction - The interaction object representing the slash command interaction.
     * @returns {Promise<void>} A promise that resolves when the command has been executed.
     */
    async run(interaction) {
        await this.execute(interaction);
    }

    /**
     * Converts the slash command to a JSON object.
     * 
     * @returns {Object} The JSON representation of the slash command.
     */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options
        };
    }
}

module.exports = SlashCommand;
