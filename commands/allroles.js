"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var guild = m.channel.guild;
        var roleNames = guild.roles.map(r => r.name).join("  |  ");
        if (roleNames.length > 2000) {
            await m.reply(`Sorry, but the ${guild.roles.size} roles in this server are too many to show in a message. This is a discord limitation and can't be bypassed.`, 10000);
            await m.deleteIn(10000);
            return;
        }

        await m.reply(roleNames);
    },
    help: "Role list"
};
