"use strict";

module.exports = {
    main: function(bot, m, args, prefix) {
        var roles = m.guild.roles;

        var roleDump = roles.map(r => `"${r.name}": "${r.id}",`).join("\n");
        console.log(roleDump);

        var roleNames = roles.map(r => r.name).join("  |  ");
        m.reply(roleNames);
    },
    help: "Role list"
};
