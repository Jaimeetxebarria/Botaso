const { SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log("Bot online");
        function setRandomActivity() {
            const activity = client.randomActivity();
            client.user.setActivity(activity.name, { type: activity.type });
        }
        setRandomActivity();
        setInterval(setRandomActivity, 60000);
    },
};
