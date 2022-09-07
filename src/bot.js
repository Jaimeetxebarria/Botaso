// Require the necessary discord.js classes
require("dotenv").config();
require("colors");
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.commands = new Collection();
client.events = new Collection();
client.selectMenus = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const functionFolders = fs.readdirSync(`${__dirname}/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`${__dirname}/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) require(`${__dirname}/functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
//console.log(process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);
