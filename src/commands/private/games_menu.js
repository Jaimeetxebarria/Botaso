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
        interaction.deferReply();
        interaction.deleteReply();
        await client.channels.cache.get(process.env.roles_channel_id).send({
            components: [new ActionRowBuilder().addComponents(gamesMenu)],
        });
    },
};
