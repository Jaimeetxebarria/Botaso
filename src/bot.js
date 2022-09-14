require("dotenv").config();
require("colors");
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
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

client.login(process.env.DISCORD_TOKEN);
