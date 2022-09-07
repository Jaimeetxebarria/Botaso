module.exports = {
    data: {
        customId: "gamesMenu",
    },
    async execute(interaction, client) {
        chosenRoleID = interaction.values[0];
        const roleIDs = ["1014272702539911310", "1014272930412236831", "1014291200871768186"];

        for (const roleID of roleIDs) {
            if (interaction.member.roles.cache.has(roleID))
                await interaction.member.roles.remove(roleID);
        }

        for (const roleID of interaction.values) {
            await interaction.member.roles.add(roleID);
        }
        interaction.deferUpdate();
    },
};
