const fs = require("node:fs");
const path = require("node:path");
const { Routes, REST } = require("discord.js");
require("dotenv").config();

module.exports = (client) => {
    client.handleCommands = async function () {
        const commandsPath = path.join(__dirname, "../../commands");
        const commandsJSON = [];

        //Read folders of commands folder and their files, if js files, add them to commands
        const commandsFolder = fs.readdirSync(commandsPath);
        console.log("---------- Commands ----------".brightGreen);
        for (const folder of commandsFolder) {
            const commandFiles = fs
                .readdirSync(path.join(commandsPath, folder))
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, folder, file);
                const command = require(filePath);

                client.commands.set(command.data.name, command);
                commandsJSON.push(command.data.toJSON());
                console.log(`Loaded: ${file}`.brightGreen);
            }
        }

        //Register commands
        const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

        rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), {
            body: commandsJSON,
        })
            .then((data) =>
                console.log(
                    `Successfully registered ${data.length} application commands.`.brightGreen
                )
            )
            .catch(console.error);
    };
};
