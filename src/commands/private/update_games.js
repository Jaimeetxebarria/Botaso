const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update_menu")
        .setDescription("Actualiza el menú que asigna los roles de juegos")
        .setDefaultMemberPermissions(0), //Sólo visible para admins

    async execute(interaction, client) {
        if ((await interaction.guild.ownerId) !== interaction.user.id) {
            await interaction.reply({
                content: "Sólo el propietario del servidor puede usar este comando",
                ephemeral: true,
            });
            return;
        }

        client.channels.cache
            .get(process.env.roles_channel_id)
            .messages.fetch(process.env.games_menu_id)
            .then((msg) => {
                const gamesMenu = new SelectMenuBuilder()
                    .setCustomId("gamesMenu")
                    .setMaxValues(9)
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
                        },
                        {
                            label: "Minecraft",
                            value: process.env.minecraft_id,
                            emoji: "1017798914893676675",
                        },
                        {
                            label: "CSGO",
                            value: process.env.CSGO_id,
                            emoji: "1017800365653102692",
                        },
                        {
                            label: "Factorio",
                            value: process.env.factorio_id,
                            emoji: "1017410575455760474",
                        },
                        {
                            label: "FIFA",
                            value: process.env.FIFA_id,
                            emoji: "1017803659100311632",
                        },
                        {
                            label: "Fortnite",
                            value: process.env.fortnite_id,
                            emoji: "1017803094823800922",
                        }
                    );
                msg.edit({
                    components: [new ActionRowBuilder().addComponents(gamesMenu)],
                });
            });
    },
};
