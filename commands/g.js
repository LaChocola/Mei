"use strict";

const ordinal = require("ordinal");

const utils = require("../utils");
const dbs = require("../dbs");
const lewdGen = require("../lewdGen");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var globalData = await dbs.global.load();

        var time = new Date().toISOString();

        args = args.toLowerCase();

        var mentioned = m.mentions[0] || m.author;
        var userId = mentioned.id;
        var name1 = args;
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        mentioned = m.mentions[0] || member || m.author;
        var commandStats = globalData.commands["g"] || { totalUses: 0, users: {} };
        var usage = 0;
        if (commandStats.users[mentioned.id]) {
            usage = commandStats.users[mentioned.id];
        }
        if (args.indexOf("length") >= 0) {
            var names = await lewdGen.getCustomGtsNames(userId);
            var resultstring = "";
            var cleanishNames = names.join(", ");
            for (let i = 0; i < names.length; i++) {
                if (i % 5 === 0) {
                    cleanishNames.replace(names[i], `${names[i]}\n`);
                }
            }
            resultstring += "**Names available: **" + names.length + "\n " + cleanishNames + "\n\n" + lewdGen.getLewdCounts("gentle");
            if (names.length < 1) {
                names = lewdGen.getDefaultGtsNames(m.guild.id);
                resultstring = "**Names available: **" + names.totalnames + "\n " + names.cleannames + "\n\n" + lewdGen.getLewdCounts("gentle");
            }

            m.reply({
                embed: {
                    "color": 0xA260F6,
                    "description": resultstring
                }
            });
            return;
        }

        if (args.indexOf("someone") >= 0) {
            userId = utils.chooseMember(m.guild.members).id;
            // TODO: Handle the case where there are no applicable members to choose from
        }
        var bigName;

        names = lewdGen.getDefaultGtsNames(m.guild.id).names;
        var cnames = await lewdGen.getCustomGtsNames(userId);
        names = names.concat(cnames);
        for (let i = 0; i < names.length; i++) {
            if (args.includes(names[i].toLowerCase())) {
                bigName = names[i];
            }
        }

        var maintype = "gentle";
        var subtype = args;

        if (args.indexOf("invert") >= 0 || args.indexOf("inverse") >= 0) {
            bigName = m.member.name;
        }
        var guildId = m.guild.id;

        var lewdmessage = await lewdGen.generateLewdMessage(userId, bigName, guildId, maintype, subtype);

        var usageText = ordinal(usage);
        var data = {
            embed: {
                color: 0xFF00DC,
                title: `${lewdmessage[1]} ${lewdmessage[2]}`,
                description: lewdmessage[0],
                timestamp: time,
                footer: {
                    text: `${usageText} response`,
                    icon_url: mentioned.avatarURL
                }
            }
        };
        m.reply(data);
        return;
    },
    help: "A Gentle smush"
};
