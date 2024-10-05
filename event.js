class Event {
    constructor(name, execute) {
        this.name = name;
        this.execute = execute;
    }

    register(client) {
        client.on(this.name, this.execute);
    }
}

module.exports = Event;
