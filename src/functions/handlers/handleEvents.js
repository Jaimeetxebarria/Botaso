const fs = require("node:fs");
const path = require("node:path");

module.exports = (client) => {
    client.handleEvents = async function () {
        const eventsPath = path.join(__dirname, "../../events");
        const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
        console.log("---------- Events ----------".brightBlue);

        for (const file of eventFiles) {
            console.log(`Loaded: ${file}`.brightBlue);
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
        }
    };
};
