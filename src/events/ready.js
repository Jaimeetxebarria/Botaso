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

        client.channels.cache
            .get("1014280551395508324")
            .messages.fetch("1017481575929217035")
            .then((msg) => {
                const gamesMenu = new SelectMenuBuilder()
                    .setCustomId("gamesMenu")
                    .setMaxValues(4)
                    .setMinValues(0)
                    .setPlaceholder("¿A qué juegas?")
                    .setOptions(
                        {
                            label: "De todo un poco",
                            description: "Acceso a toda la zona de gaming sin pingeos",
                            value: "1017468559938568302",
                            emoji: "🕹️",
                        },
                        {
                            label: "League of Legends",
                            value: "1014272702539911310",
                            emoji: "1014285846855286789",
                        },
                        {
                            label: "Valorant",
                            value: "1014272930412236831",
                            emoji: "1014287466276069448",
                        },
                        {
                            label: "Rainbow Six",
                            value: "1014291200871768186",
                            emoji: "1014291034865414206",
                        }
                    );
                msg.edit({
                    components: [new ActionRowBuilder().addComponents(gamesMenu)],
                });
            });
    },
};
