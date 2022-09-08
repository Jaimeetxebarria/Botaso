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
                    value: process.env.year_1_id,
                },
                {
                    label: "2º",
                    value: process.env.year_2_id,
                },
                {
                    label: "3º",
                    value: process.env.year_3_id,
                },
                {
                    label: "4º",
                    value: process.env.year_4_id,
                },
                {
                    label: "5º",
                    value: process.env.year_5_id,
                }
            );
        interaction.deferReply();
        interaction.deleteReply();
        await client.channels.cache.get(process.env.roles_channel_id).send({
            components: [new ActionRowBuilder().addComponents(yearsMenu)],
        });
    },
};
