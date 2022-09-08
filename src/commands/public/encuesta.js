const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("encuesta")
        .setDescription("Crea una encuesta")
        .addStringOption((option) =>
            option
                .setName("título")
                .setDescription("El título o la pregunta que quieras hacer")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("opciones")
                .setDescription(
                    "Las posibles respuestas separadas por '|'. P. ej. Sí | No | Me da igual. Por defecto es Sí | No"
                )
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("duración")
                .setDescription(
                    "La duración de la encuesta (luego se cierra). Ejemplos: 10min, 1h30m, 12h, 1d 12h..."
                )
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("roles_permitidos")
                .setDescription("Menciona los roles que pueden votar. Por defecto @everyone")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("múltiples_votos")
                .setDescription(
                    "Si se puede votar una sola opción o varias. Por defecto no se puede (False)"
                )
                .setRequired(false)
        ),

    async execute(interaction, client) {
        let poll = new Poll();
        poll.initPoll(
            interaction.options.get("título").value,
            interaction.options.get("opctiones")?.value ?? [
                new PollOption("Sí"),
                new PollOption("No"),
            ],
            interaction.options.get("duración")?.value ?? Infinity,
            interaction.options.get("roles_permitidos")?.value ?? "everyone",
            interaction.options.get("múltiples_votos")?.value ?? false,
            interaction
        );
    },
};

function getTimeInSecFromFormattedTime(time) {
    let symbols = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
    };
    const matches = time.toLowerCase().match(/\d+[dhms]/g);
    if (matches === null) return undefined;

    const sum = matches.reduce(
        (accumulator, match) =>
            accumulator + parseFloat(match.slice(0, -1)) * symbols[match.slice(-1)],
        0
    );
    return sum;
}

class PollOption {
    constructor(name) {
        this.name = name;
    }
}

class Poll {
    constructor() {}
    async initPoll(title, options, duration, allowedMentions, multipleVotes, interaction) {
        console.log(
            `New Poll: ${title}, options: ${options}, duration: ${duration}, allowedMentions: ${allowedMentions}, multipleVotes: ${multipleVotes}`
        );
        const pollAuthor = interaction.member;

        //Manage duration. Convert formatted time into seconds.Example: 5m = 300
        this.duration = duration === Infinity ? Infinity : getTimeInSecFromFormattedTime(duration);

        if (this.duration === undefined) {
            interaction.reply({
                content: `El formato de tiempo que has puesto en la duración de la encuesta no es correcto :'(\nEjemplos correctos: 10 minutos -> 10m, hora y media -> 1h30m.\nPuedes usar: "s" (segundos), "m" (minutos), "h" (horas) y "d" (días)`,
                ephemeral: true,
            });
            return;
        }

        const startTime = Math.trunc(Date.now() / 1000);

        //Manage options
        this.options = options;

        if (typeof this.options === "string") {
            //Split with | separator
            this.options = this.options.split("|");
            //Remove spaces in front and back
            this.options = this.options.map((option) => {
                return new PollOption(option.trim());
            });
        }

        //Manage allowed roles and members
        //Parse roles and  and get IDs
        this.allowedMentions = allowedMentions;
        this.allowedRoles = Array.from(this.allowedMentions.matchAll(/<@&(\d+)>/g)).map(
            (role) => role[1]
        );
        this.allowedMembers = Array.from(this.allowedMentions.matchAll(/<@(\d+)>/g)).map(
            (role) => role[1]
        );

        //Manage multipleVotes
        this.multipleVotes = multipleVotes;

        //Create votes database
        this.votes = new Object();
        for (const option of this.options) {
            this.votes[option.name] = [];
        }

        //Manage description
        let description = "";

        description += this.getDescriptionOptions();
        description += "\n*---*\n";
        description +=
            this.duration === Infinity
                ? ":infinity: Esta encuesta no caduca"
                : `:hourglass: <t:${startTime + this.duration}:R>`;
        description += `\n:ballot_box: ${
            this.allowedMentions === "everyone"
                ? "@everyone puede votar"
                : this.allowedMentions.replace(" ", ", ") + "pueden votar"
        }`;

        this.pollEmbed = {
            color: 0xfc8003,
            title: title,
            description: description,
        };

        this.buttons = new ActionRowBuilder();
        //Case binary option
        if (this.options.length === 2) {
            this.buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId(this.options[0].name + startTime.toString())
                    .setLabel(this.options[0].name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🗳"),
                new ButtonBuilder()
                    .setCustomId(this.options[1].name + startTime.toString())
                    .setLabel(this.options[1].name)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("🗳")
            );
        }
        //Otherwise all primary buttons
        else {
            for (const option of this.options) {
                this.buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(option.name + startTime.toString())
                        .setLabel(option.name)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🗳")
                );
            }
        }

        //Set timeout for result collecting or add close poll button
        if (this.duration === Infinity) {
            this.buttons.addComponents(
                new ButtonBuilder()
                    .setCustomId("close_poll" + startTime.toString())
                    .setLabel("Cerrar encuesta")
                    .setStyle(ButtonStyle.Danger)
            );
        } else {
            setTimeout(async () => await this.closePoll(), this.duration * 1000);
        }

        await interaction.deferReply();
        await interaction.deleteReply();
        this.pollInteraction = await interaction.channel.send({
            embeds: [this.pollEmbed],
            components: [this.buttons],
        });

        const voteCollectorParameters =
            this.duration === Infinity
                ? {
                      componentType: ComponentType.Button,
                      dispose: true,
                  }
                : {
                      componentType: ComponentType.Button,
                      time: this.duration * 1000,
                      dispose: true,
                  };
        const voteCollector =
            interaction.channel.createMessageComponentCollector(voteCollectorParameters);

        voteCollector.on("collect", async (interaction) => {
            //Close poll button
            if (interaction.customId === "close_poll" + startTime.toString()) {
                if (interaction.member.id === pollAuthor.id) {
                    voteCollector.stop();
                    await this.closePoll();
                    return;
                } else {
                    interaction.reply({
                        content: `No tienes permiso para cerrar esta encuesta.\nSólamente puede el autor (<@${pollAuthor.id}>) puede hacerlo.`,
                        ephemeral: true,
                    });
                    return;
                }
                //A call from the same button of another poll
            } else if (interaction.customId.startsWith("close_poll")) return;

            //Vote permission
            const canVote =
                this.allowedRoles.some((roleID) => interaction.member.roles.cache.has(roleID)) ||
                this.allowedMembers.some((memberID) => interaction.member.id === memberID);

            if (!canVote && this.allowedMentions !== "everyone") {
                interaction.reply({
                    content: `No tienes permiso para votar en esta encuesta.\nVotantes permitidos: ${this.allowedMentions}.`,
                    ephemeral: true,
                });
                return;
            }

            const button = this.buttons.components.find(
                (button) => button.data.custom_id === interaction.customId
            );
            //If this poll has an option named the same as other poll but with different ID it wont
            if (button === undefined) return;
            //console.log("button data" + button.data.custom_id.toString());
            const voteOption = this.votes[button.data.label];

            //When multiple votes are enabled
            if (this.multipleVotes === true) {
                //If already voted remove the vote
                if (voteOption.includes(interaction.member.id)) {
                    this.votes[button.data.label] = voteOption.filter(
                        (id) => id !== interaction.member.id
                    );
                } else {
                    this.votes[button.data.label].push(interaction.member.id);
                }
                this.updateEmbed();
                interaction.deferUpdate();
                await this.pollInteraction.edit({
                    embeds: [this.pollEmbed],
                    components: [this.buttons],
                });
            }
            //When multiple votes are disabled
            else {
                //Remove all the votes of that user
                Object.entries(this.votes).forEach((vote) => {
                    this.votes[vote[0]] = vote[1].filter((id) => id !== interaction.member.id);
                });
                this.votes[button.data.label].push(interaction.member.id);
                this.updateEmbed();
                interaction.deferUpdate();
                await this.pollInteraction.edit({
                    embeds: [this.pollEmbed],
                    components: [this.buttons],
                });
            }
        });
        voteCollector.collect("end", async () => await this.closePoll());
    }

    async closePoll() {
        let description = this.getDescriptionOptions();
        description += "\n*---*\n";
        description += `:hourglass: La encuesta terminó <t:${Math.trunc(Date.now() / 1000)}:R>`;
        description += `\n:ballot_box: ${
            this.allowedMentions === "everyone"
                ? "@everyone pudo votar"
                : this.allowedMentions.replace(" ", ", ") + "pudieron votar"
        }`;

        this.resulsEmbed = {
            color: this.pollEmbed.color,
            title: this.pollEmbed.title,
            description: description,
        };
        await this.pollInteraction.edit({ embeds: [this.resulsEmbed], components: [] });
    }

    getDescriptionOptions() {
        //Manage description
        let descriptionOptions = this.options.map((option) => `**${option.name}**\n`); //Add option names

        //Add option bars
        const BAR_LENGTH = 12;
        let totalVotes = Object.entries(this.votes).reduce((prev, cur) => prev + cur[1].length, 0);
        Object.entries(this.votes).forEach((vote, index) => {
            const votePercentage = (vote[1].length / totalVotes) * 100 || 0;
            const barColorLength = Math.floor((votePercentage / 100) * BAR_LENGTH);
            descriptionOptions[index] += `${
                "🟦".repeat(barColorLength) + "⬛".repeat(BAR_LENGTH - barColorLength)
            }`;
            descriptionOptions[index] += `\`${Math.round(votePercentage)}% (${vote[1].length})\`\n`;
        });
        return descriptionOptions.join("\n");
    }

    updateEmbed() {
        //Manage description
        let description = "";

        description += this.getDescriptionOptions();
        description += "\n*---*\n";
        description +=
            this.duration === Infinity
                ? ":infinity: Esta encuesta no caduca"
                : `:hourglass: <t:${startTime + this.duration}:R>`;
        description += `\n:ballot_box: ${
            this.allowedMentions === "everyone"
                ? "@everyone puede votar"
                : this.allowedMentions.replace(" ", ", ") + "pueden votar"
        }`;

        this.pollEmbed = {
            color: this.pollEmbed.color,
            title: this.pollEmbed.title,
            description: description,
        };
    }
}
