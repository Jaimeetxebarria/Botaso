module.exports = {
    data: {
        customId: "yearsMenu",
    },
    async execute(interaction, client) {
        chosenRoleID = interaction.values[0];
        const roleIDs = [
            "1014493019245916190",
            "1014493106109952080",
            "1014493145079226458",
            "1014493183448711229",
            "1014493288788668496",
        ];
        await interaction.member.roles.add(interaction.values[0]);

        for (roleID of roleIDs) {
            if (roleID === chosenRoleID) continue; //Skip if this role is the chosen one, 100% doesn't have it
            if (interaction.member.roles.cache.has(roleID))
                await interaction.member.roles.remove(roleID);
        }
        interaction.deferUpdate();
    },
};
