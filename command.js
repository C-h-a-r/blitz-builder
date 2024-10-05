class Command {
    constructor(name, description, execute) {
        this.name = name;
        this.description = description;
        this.execute = execute;
    }

    run(message, args) {
        this.execute(message, args);
    }
}

module.exports = Command;
