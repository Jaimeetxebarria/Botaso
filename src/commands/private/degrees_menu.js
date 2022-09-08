const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("degrees_menu")
        .setDescription("Envía por #roles el menú que asigna los roles de carrera")
        .setDefaultMemberPermissions(0), //Sólo visible para admins

    async execute(interaction, client) {
        if ((await interaction.guild.ownerId) !== interaction.user.id) {
            await interaction.reply({
                content: "Sólo el propietario del servidor puede usar este comando",
                ephemeral: true,
            });
            return;
        }

        const degreesMenu = new SelectMenuBuilder()
            .setCustomId("degreesMenu")
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("¿Qué carrera estás estudiando?")
            .setOptions(
                {
                    label: "Ingeniería Informática",
                    value: process.env.ingenieria_informatica_id,
                },
                {
                    label: "Ciencia de Datos e Inteligencia Artificial",
                    value: process.env.ciencia_de_datos_id,
                },
                {
                    label: "Ingeniería Informática + Ciencia de Datos e IA",
                    value: process.env.informatica_ciencia_datos_id,
                },
                {
                    label: "Ingeniería Informática + Videojuegos, RV y RA",
                    value: process.env.informatica_videojuegos_id,
                },
                {
                    label: "Ingeniería Informática + Transformación Digital de la Empresa",
                    value: process.env.informatica_TDE_id,
                },
                {
                    label: "Ingeniería Informática + ADE",
                    value: process.env.informatica_ADE_id,
                }
            );
        interaction.deferReply();
        interaction.deleteReply();
        await client.channels.cache.get(process.env.roles_channel_id).send({
            components: [new ActionRowBuilder().addComponents(degreesMenu)],
        });
    },
};
