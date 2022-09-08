module.exports = {
    data: {
        customId: "yearsMenu",
    },
    async execute(interaction, client) {
        interaction.deferUpdate();
        chosenRoleID = interaction.values[0];
        const roleIDs = [
            process.env.year_1_id,
            process.env.year_2_id,
            process.env.year_3_id,
            process.env.year_4_id,
            process.env.year_5_id,
        ];
        await interaction.member.roles.add(interaction.values[0]);

        for (roleID of roleIDs) {
            if (roleID === chosenRoleID) continue; //Skip if this role is the chosen one, 100% doesn't have it
            if (interaction.member.roles.cache.has(roleID))
                await interaction.member.roles.remove(roleID);
        }
    },
};
