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
                    value: "1014211136259895376",
                },
                {
                    label: "Ciencia de Datos e Inteligencia Artificial",
                    value: "1014211299430907955",
                },
                {
                    label: "Ingeniería Informática + Ciencia de Datos e IA",
                    value: "1015821057237729290",
                },
                {
                    label: "Ingeniería Informática + Videojuegos, RV y RA",
                    value: "1014213621187891210",
                },
                {
                    label: "Ingeniería Informática + Transformación Digital de la Empresa",
                    value: "1014212148022489168",
                },
                {
                    label: "Ingeniería Informática + ADE",
                    value: "1014408582227312700",
                }
            );
        interaction.deferReply();
        interaction.deleteReply();
        await client.channels.cache.get(process.env.roles_channel_id).send({
            components: [new ActionRowBuilder().addComponents(degreesMenu)],
        });
    },
};
