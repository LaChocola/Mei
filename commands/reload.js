"use strict";

const ids = require("../ids");
const cmdmanager = require("../cmdmanager");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        // ignore non-chocolas
        if (!(m.author.id === ids.users.chocola || m.author.id === await bot.getOwnerID())) {
            console.log("Unauthorized attempt to run reload command");
            return;
        }

        var cmdName = args.toLowerCase();
        if (!cmdName) {
            m.reply("Please tell me what command to reload.", 5000, true);
            return;
        }

        try {
            if (cmdName === "all") {
                cmdmanager.reloadAll();
            }
            else {
                cmdmanager.reload(cmdName);
            }
        }
        catch(err) {
            console.error(`Failed to reload ${cmdName}`, err);
            m.reply(`I couldn't reload ${cmdName}.`, 5000, true);
            return;
        }

        m.reply(`Successfully reloaded ${cmdName}`, 5000, true);
    },
    help: "Makes me say something"
};
