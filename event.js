/**
 * Class representing an event.
 */
class Event {
    /**
     * Creates an instance of Event.
     * 
     * @param {string} name - The name of the event (e.g., 'messageCreated', 'ready').
     * @param {Function} execute - The function to be executed when the event is triggered.
     */
    constructor(name, execute) {
        /**
         * The name of the event.
         * @type {string}
         */
        this.name = name;

        /**
         * The function to execute when the event is triggered.
         * @type {Function}
         */
        this.execute = execute;
    }

    /**
     * Registers the event listener with the client.
     * 
     * @param {Object} client - The client object (a Discord.js client) to register the event with.
     */
    register(client) {
        client.on(this.name, this.execute);
    }
}

module.exports = Event;
