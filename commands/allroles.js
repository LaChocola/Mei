"use strict";

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var guild = m.channel.guild;
        function roleSearch(role) {
            var roleName = role.name;
            if (roleName !== "undefined") {
                return roleName;
            }
        }
        var roles = guild.roles.map(roleSearch);
        var amount = guild.roles.size;
        var roleList = roles.join("  |  ");
        if (roleList.length > 2000) {
            Bot.createMessage(m.channel.id, `Sorry, but the ${amount} roles in this servver are too many to show in a message. This is a discord limitation and can't be bypassed.`).then(function (msg) {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 10000);
            });
            return;
        }
        Bot.createMessage(m.channel.id, roles.join("  |  "));
    },
    help: "Role list"
};
