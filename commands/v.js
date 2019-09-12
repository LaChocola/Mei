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

        if (!m.channel.nsfw) {
            m.reply("This command can only be used in NSFW channels");
            return;
        }

        var mentioned = m.mentions[0] || m.author;
        var id = mentioned.id;
        var name1 = args;
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        mentioned = m.mentions[0] || member || m.author;
        var commandStats = globalData.commands["v"] || { totalUses: 0, users: {} };
        var usage = 0;
        if (commandStats.users[mentioned.id]) {
            usage = commandStats.users[mentioned.id];
        }
        if (args.indexOf("length") >= 0) {
            var names = await lewdGen.getCustomGtsNames(id);
            var resultstring = "";
            var cleanishNames = names.join(", ");
            for (let i = 0; i < names.length; i++) {
                if (i % 5 === 0) {
                    cleanishNames.replace(names[i], `${names[i]}\n`);
                }
            }
            resultstring += "**Names available: **" + names.length + "\n " + cleanishNames + "\n\n" + lewdGen.getLewdCounts("violent");
            if (names.length < 1) {
                names = lewdGen.getDefaultGtsNames(m.channel.guild.id);
                resultstring = "**Names available: **" + names.totalnames + "\n " + names.cleannames + "\n\n" + lewdGen.getLewdCounts("violent");
            }

            m.reply({
                embed: {
                    "color": 0xA260F6,
                    "description": resultstring.replace(/Violents/g, "Smushes")
                }
            });
            return;
        }

        if (args.indexOf("someone") >= 0) {
            id = utils.chooseMember(m.channel.guild.members).id;
            // TODO: Handle the case where there are no applicable members to choose from
        }
        var smallid = id;
        var big = false;

        names = lewdGen.getDefaultGtsNames(m.channel.guild.id).names;
        var cnames = await lewdGen.getCustomGtsNames(smallid);
        names = names.concat(cnames);
        for (let i = 0; i < names.length; i++) {
            if (args.includes(names[i].toLowerCase())) {
                big = names[i];
            }
        }

        var maintype = "violent";
        var subtype = args;

        if (args.indexOf("invert") >= 0 || args.indexOf("inverse") >= 0) {
            big = m.member.name;
        }
        var guildid = m.channel.guild.id;

        var lewdmessage = lewdGen.generateLewdMessage(smallid, big, guildid, maintype, subtype);

        var usageText = "0";
        if (usage > 0) {
            usageText = ordinal(usage);
        }
        var data = {
            embed: {
                color: 0xA260F6,
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
    help: "A Violent Smush"
};
