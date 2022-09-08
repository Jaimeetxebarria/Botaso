module.exports = {
    data: {
        customId: "gamesMenu",
    },
    async execute(interaction, client) {
        interaction.deferUpdate();
        const roleIDs = [
            process.env.gaming_id,
            process.env.league_of_legends_id,
            process.env.valorant_id,
            process.env.rainbow_six_id,
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
