module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.content === `<@${process.env.clientID}>`)
            message.channel.send(`Dígame <@${message.author.id}>`);
        if (message.content.toLowerCase() === "que" || message.content.toLowerCase() === "qué")
            message.reply("so");
    },
};
