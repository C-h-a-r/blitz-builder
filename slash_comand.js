class SlashCommand {
    constructor(name, description, options, execute) {
        this.name = name;
        this.description = description;
        this.options = options || []; 
        this.execute = execute;
    }

    async run(interaction) {
        await this.execute(interaction);
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options
        };
    }
}

module.exports = SlashCommand;
