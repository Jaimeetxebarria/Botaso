module.exports = {
    data: {
        customId: "degreesMenu",
    },
    async execute(interaction, client) {
        chosenRoleID = interaction.values[0];
        const roleIDs = [
            "1014211136259895376",
            "1015821057237729290",
            "1014213621187891210",
            "1014212148022489168",
            "1014211299430907955",
            "1014408582227312700",
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
