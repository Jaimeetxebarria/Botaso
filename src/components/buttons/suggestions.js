const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: { customId: "suggestionButton" },
    async execute(interaction, client) {
        const suggestionsModal = new ModalBuilder()
            .setCustomId("suggestion")
            .setTitle("Escribe tu sugerencia")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("suggestionContent")
                        .setLabel("Sugerencia")
                        .setRequired(true)
                        .setMinLength(10)
                        .setStyle(TextInputStyle.Paragraph)
                )
            );
        await interaction.showModal(suggestionsModal);
    },
};
