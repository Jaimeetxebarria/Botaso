module.exports = {
    data: {
        customId: "gamesMenu",
    },
    async execute(interaction, client) {
        interaction.deferUpdate();
        const roleIDs = [
            "1017468559938568302",
            "1014272702539911310",
            "1014272930412236831",
            "1014291200871768186",
        ];

        for (const roleID of roleIDs) {
            if (interaction.member.roles.cache.has(roleID))
                await interaction.member.roles.remove(roleID);
        }

        for (const roleID of interaction.values) {
            await interaction.member.roles.add(roleID);
        }
    },
};
