const { ActivityType } = require("discord.js");

module.exports = (client) => {
    client.randomActivity = function () {
        const activityOptions = [
            {
                type: ActivityType.Listening,
                name: "The Wild Project",
            },
            {
                type: ActivityType.Playing,
                name: "League of Legends",
            },
            {
                type: ActivityType.Competing,
                name: "petanca",
            },
            {
                type: ActivityType.Watching,
                name: "reddit",
            },
        ];

        return activityOptions[Math.floor(Math.random() * activityOptions.length)];
    };
};
