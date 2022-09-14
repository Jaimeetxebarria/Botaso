module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member, client) {
        member.send(
            `¡Hola! Soy <@1015162339152121918>, el bot del servidor de Ingeniería Informática. Elige tus roles en <#${process.env.roles_channel_id}> para poder acceder al resto del servidor :D`
        );
    },
};
