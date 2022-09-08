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
            .get(process.env.roles_channel_id)
            .messages.fetch(process.env.games_menu_id)
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
                            value: process.env.gaming_id,
                            emoji: "🕹️",
                        },
                        {
                            label: "League of Legends",
                            value: process.env.league_of_legends_id,
                            emoji: "1014285846855286789",
                        },
                        {
                            label: "Valorant",
                            value: process.env.valorant_id,
                            emoji: "1014287466276069448",
                        },
                        {
                            label: "Rainbow Six",
                            value: process.env.rainbow_six_id,
                            emoji: "1014291034865414206",
                        }
                    );
                msg.edit({
                    components: [new ActionRowBuilder().addComponents(gamesMenu)],
                });
            });
    },
};
