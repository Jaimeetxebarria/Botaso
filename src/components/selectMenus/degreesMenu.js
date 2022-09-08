module.exports = {
    data: {
        customId: "degreesMenu",
    },
    async execute(interaction, client) {
        interaction.deferUpdate();
        chosenRoleID = interaction.values[0];
        const roleIDs = [
            process.env.ingenieria_informatica_id,
            process.env.ciencia_de_datos_id,
            process.env.informatica_ciencia_datos_id,
            process.env.informatica_videojuegos_id,
            process.env.informatica_TDE_id,
            process.env.informatica_ADE_id,
        ];
        await interaction.member.roles.add(interaction.values[0]);

        for (roleID of roleIDs) {
            if (roleID === chosenRoleID) continue; //Skip if this role is the chosen one, 100% doesn't have it
            if (interaction.member.roles.cache.has(roleID))
                await interaction.member.roles.remove(roleID);
        }
    },
};
