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
            process.env.minecraft_id,
            process.env.CSGO_id,
            process.env.factorio_id,
            process.env.FIFA_id,
            process.env.fortnite_id,
        ];

        for (const roleID of roleIDs) {
            if (interaction.values.includes(roleID)) {
                await interaction.member.roles.add(roleID);
            } else if (interaction.member.roles.cache.has(roleID)) {
                await interaction.member.roles.remove(roleID);
            }
        }
    },
};
