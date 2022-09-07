module.exports = {
    data: { customId: "suggestion" },
    async execute(interaction, client) {
        const owner = await interaction.guild.fetchOwner();

        const user =
            interaction.member.nickname === null
                ? interaction.user.username
                : interaction.user.username + " a.k.a. " + interaction.member.nickname;

        const message = `Nueva sugerencia de ${user}:\n${interaction.fields.getTextInputValue(
            "suggestionContent"
        )}`;

        owner.send(message);
        await interaction.reply({
            content: "Tu sujerencia/queja ha sido enviada correctamente :D",
            ephemeral: true,
        });
    },
};
