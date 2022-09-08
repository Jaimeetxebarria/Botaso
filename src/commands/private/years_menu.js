const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("years_menu")
        .setDescription("Envía por #roles el menú que asigna los roles de año")
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
            .setCustomId("yearsMenu")
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("¿En qué curso estás?")
            .setOptions(
                {
                    label: "1º",
                    value: "1014493019245916190",
                },
                {
                    label: "2º",
                    value: "1014493106109952080",
                },
                {
                    label: "3º",
                    value: "1014493145079226458",
                },
                {
                    label: "4º",
                    value: "1014493183448711229",
                },
                {
                    label: "5º",
                    value: "1014493288788668496",
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
