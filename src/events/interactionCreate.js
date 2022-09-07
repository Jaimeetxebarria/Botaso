module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "Ha habido un error al ejecutar el comando :(",
                    ephemeral: true,
                });
            }
        } else if (interaction.isSelectMenu()) {
            const menu = client.selectMenus.get(interaction.customId);
            if (!menu) return new Error("Este menú no tiene código asociado");

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return new Error("Este botón no tiene código asociado");

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return new Error("Este modal no tiene código asociado");

            try {
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
