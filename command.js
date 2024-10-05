/**
 * Class representing a command.
 */
class Command {
    /**
     * Creates an instance of Command.
     * 
     * @param {string} name - The name of the command.
     * @param {string} description - A brief description of the command.
     * @param {Function} execute - The function to execute when the command is triggered.
     */
    constructor(name, description, execute) {
        /**
         * The name of the command.
         * @type {string}
         */
        this.name = name;

        /**
         * The description of the command.
         * @type {string}
         */
        this.description = description;

        /**
         * The function to execute when the command is triggered.
         * @type {Function}
         */
        this.execute = execute;
    }

    /**
     * Executes the command.
     * 
     * @param {Object} message - The message object (from Discord.js) containing details of the message.
     * @param {Array<string>} args - An array of arguments passed to the command.
     */
    run(message, args) {
        this.execute(message, args);
    }
}

module.exports = Command;
