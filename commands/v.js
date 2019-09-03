"use strict";

const ordinal = require("ordinal");

const utils = require("../utils");
const misc = require("../misc");
const dbs = require("../dbs");

var globalData = dbs.global.load();
var time = new Date().toISOString();

module.exports = {
    main: async function(bot, m, args, prefix) {
        args = args.toLowerCase();

        if (m.channel.guild.id === conf.guilds.guild1) {
            prefix = "?";
        }

        if (m.channel.nsfw == false) {
            m.reply("This command can only be used in NSFW channels");
            return;
        }

        var mentioned = m.mentions[0] || m.author;
        var id = mentioned.id;
        var name1 = args;
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        mentioned = m.mentions[0] || member || m.author;
        var commands = globalData.commands["v"].users;
        var usage = 0;
        if (commands[mentioned.id]) {
            usage = commands[mentioned.id];
        }
        if (args.indexOf("length") >= 0) {
            var names = misc.getcustomGTSNames(id);
            var resultstring = "";
            var cleanishNames = names.join(", ");
            for (let i = 0; i < names.length; i++) {
                if (i % 5 === 0) {
                    cleanishNames.replace(names[i], `${names[i]}\n`);
                }
            }
            resultstring += "**Names avaible: **" + names.length + "\n " + cleanishNames + "\n \n" + misc.getLewdCounts("violent");
            if (names.length < 1) {
                names = misc.getDefaultGTSNames(m.channel.guild.id);
                resultstring = "**Names avaible: **" + names.totalnames + "\n " + names.cleannames + "\n \n" + misc.getLewdCounts("violent");
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
            id = misc.getSomeone(m);
        }
        var smallid = id;
        var big = false;

        names = misc.getDefaultGTSNames(m.channel.guild.id).names;
        var cname = misc.getcustomGTSNames(smallid);
        names = names.concat(cname);
        for (let i = 0; i < names.length; i++) {
            if (args.includes(names[i].toLowerCase())) {
                big = names[i];
            }
        }

        var maintype = "violent";
        var subtype = misc.searchForLewd(args);

        if (args.indexOf("invert") >= 0 || args.indexOf("inverse") >= 0) {
            big = misc.getTrueName(m.author.id, m);
        }
        var guildid = m.channel.guild.id;

        var lewdmessage = misc.generateLewdMessage(smallid, big, guildid, maintype, subtype);

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
