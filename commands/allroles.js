"use strict";

module.exports = {
    main: function(Bot, m, args, prefix) {
        var roles = m.guild.roles;
        var roleNames = roles.map(r => r.name).join("  |  ");
        var roleDumps = roles.map(r => `"${r.name}": "${r.id}",`).join("\n");

        console.log(roleDumps);
        Bot.createMessage(m.channel.id, roleNames);
    },
    help: "Role list"
};
