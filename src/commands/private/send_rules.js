const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send_rules")
        .setDescription("Envia las normas por el canal de normas")
        .setDefaultMemberPermissions(0), //Sólo visible para admins

    async execute(interaction, client) {
        if ((await interaction.guild.ownerId) !== interaction.user.id) {
            await interaction.reply({
                content: "Sólo el propietario del servidor puede usar este comando",
                ephemeral: true,
            });
            return;
        }
        const normasEmbed = [
            {
                color: 0xca4648, //0x00d166
                title: "**Prohibido el contenido NSFW**",
                description:
                    "Está prohibido compartir contenido gore o pornográfico en cualquier formato: Imágenes, vídeos, sonidos, stickers, gifs, links...",
            },
            {
                color: 0xca4648,
                title: "**Prohibido el spam o flood**",
                description:
                    "No está permitido el __envío excesivo__ de mensajes (flood) ni la publicidad __siempre y cuando__ \
                            no se trate de temas relacionados con la universidad o proyectos personales. En estos casos **sí está permitido**.",
            },
            {
                color: 0xca4648,
                title: "**Se respetuoso**",
                description:
                    "Nada de discriminación por etnia, ideología, religión, género, edad, discapacidad... El __humor negro está permitido__ siempre y cuando no se haga fuera de lugar.",
            },
            {
                color: 0xca4648,
                title: "**Utilizar cada canal para lo que es**",
                description:
                    "Cada canal tiene un título descriptivo o una descripción. Si no sabes qué canal es el correcto, usa <#1014208965158121579>.",
            },
        ];

        await client.channels.cache.get(process.env.rules_channel_id).send({ embeds: normasEmbed }); //Deusto normas: 1014208965158121575
        await interaction.deferReply();
        await interaction.deleteReply();
    },
};
