const fs = require("node:fs");
const path = require("node:path");

module.exports = (client) => {
    client.handleComponents = async function () {
        const componentsPath = path.join(__dirname, "../../components");

        const componentsFolder = fs.readdirSync(componentsPath);
        for (const folder of componentsFolder) {
            const componentFiles = fs
                .readdirSync(path.join(componentsPath, folder))
                .filter((file) => file.endsWith(".js"));

            switch (folder) {
                case "selectMenus":
                    for (const file of componentFiles) {
                        const filePath = path.join(componentsPath, folder, file);
                        const menu = require(filePath);

                        client.selectMenus.set(menu.data.customId, menu);
                    }
                    console.log("---------- Loaded: SelectMenus ----------");
                    console.log(componentFiles);
                    break;

                case "buttons":
                    for (const file of componentFiles) {
                        const filePath = path.join(componentsPath, folder, file);
                        const button = require(filePath);

                        client.buttons.set(button.data.customId, button);
                    }
                    console.log("---------- Loaded: Buttons ----------");
                    console.log(componentFiles);
                    break;

                case "modals":
                    for (const file of componentFiles) {
                        const filePath = path.join(componentsPath, folder, file);
                        const modal = require(filePath);

                        client.modals.set(modal.data.customId, modal);
                    }
                    console.log("---------- Loaded: Modals ----------");
                    console.log(componentFiles);
                    break;
            }
        }
    };
};
