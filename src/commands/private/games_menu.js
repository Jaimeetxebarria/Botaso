const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("games_menu")
        .setDescription("Envía por #roles el menú que asigna los roles de juegos")
        .setDefaultMemberPermissions(0), //Sólo visible para admins

    async execute(interaction, client) {
        if ((await interaction.guild.ownerId) !== interaction.user.id) {
            await interaction.reply({
                content: "Sólo el propietario del servidor puede usar este comando",
                ephemeral: true,
            });
            return;
        }

        const yearsMenu = new SelectMenuBuilder()
            .setCustomId("gamesMenu")
            .setMinValues(1)
            .setMaxValues(3)
            .setPlaceholder("¿A qué juegas?")
            .setOptions(
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
        interaction.deferReply();
        interaction.deleteReply();
        await client.channels.cache.get(process.env.roles_channel_id).send({
            //Deusto: 1014280551395508324
            components: [new ActionRowBuilder().addComponents(yearsMenu)],
        });
    },
};
