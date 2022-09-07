const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send_suggestions_modal")
        .setDescription("Envía por #sugerencias el modal de enviar sugerencias")
        .setDefaultMemberPermissions(0), //Sólo visible para admins

    async execute(interaction, client) {
        if ((await interaction.guild.ownerId) !== interaction.user.id) {
            await interaction.reply({
                content: "Sólo el propietario del servidor puede usar este comando",
                ephemeral: true,
            });
            return;
        }

        const embed = {
            color: 0xe2e8ed,
            description: "Para enviar una sugerecia/queja haz click sobre el botón  📩",
        };

        const suggestionButton = new ButtonBuilder()
            .setCustomId("suggestionButton")
            .setEmoji("📩")
            .setLabel("Escribir sugerencia/queja")
            .setStyle(ButtonStyle.Secondary);

        interaction.deferReply();
        interaction.deleteReply();

        await client.channels.cache.get("1014260291254624376").send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(suggestionButton)],
        });
        //Deusto: 1016851284256624740
    },
};
