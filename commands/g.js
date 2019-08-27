"use strict";

const _ = require("../people.js");
var reload = require("require-reload")(require);
var miscl = reload("../misc.js");
var data = _.load();
const use = require("../data.js");
var stats = use.load();
var time = new Date().toISOString();
var ordinal = require("ordinal");
module.exports = {
    main: function(Bot, m, args, prefix) {
        if (m.channel.guild.id == "187694240585744384") {
            prefix = "?";
        }
        if (m.content.indexOf(prefix + "g") < 0) {
            return false;
        }
        var args = args.toLowerCase();
        var mentioned = m.mentions[0] || m.author;
        var id = mentioned.id;
        var name1 = args;
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        };
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var commands = stats.commands["g"].users;
        var usage = 0;
        if (commands[mentioned.id]) {
            usage = commands[mentioned.id];
        }
        if (args.indexOf("length") >= 0) {
            var names = miscl.getcustomGTSNames(id);
            var resultstring = "";
            var cleanishNames = names.join(", ");
            for (var i = 0; i < names.length; i++) {
                if (i % 5 === 0) {
                    cleanishNames.replace(names[i], `${names[i]}\n`);
                }
            }
            var cleanNames = cleanishNames;
            resultstring += "**Names avaible: **" + names.length + "\n " + cleanishNames + "\n \n" + miscl.getLewdCounts("gentle");
            if (names.length < 1) {
                names = miscl.getDefaultGTSNames(m.channel.guild.id);
                var resultstring = "";
                resultstring += "**Names avaible: **" + names.totalnames + "\n " + names.cleannames + "\n \n" + miscl.getLewdCounts("gentle");
            }
            Bot.createMessage(m.channel.id, {
                embed: {
                    "color": 0xA260F6,
                    "description": resultstring
                }
            });
            return;
        }

        if (args.indexOf("someone") >= 0) {
            id = miscl.getSomeone(m);
        }
        var smallid = id;
        var big = false;


        var names = miscl.getDefaultGTSNames(m.channel.guild.id).names;
        var cname = miscl.getcustomGTSNames(smallid);
        names = names.concat(cname);
        for (var i = 0; i < names.length; i++) {
            if (args.includes(names[i].toLowerCase())) {
                big = names[i];
            }
        }



        var maintype = "gentle";
        var subtype = miscl.searchForLewd(args);
        if (args.indexOf("invert") >= 0 || args.indexOf("inverse") >= 0) {
            big = miscl.getTrueName(m.author.id, m);
        }
        var guildid = m.channel.guild.id;



        var lewdmessage = miscl.generateLewdMessage(smallid, big, guildid, maintype, subtype);

        if (usage !== 0) {
            usage = ordinal(+usage);
        }
        var data = {
            embed: {
                color: 0xFF00DC,
                title: `${lewdmessage[1]} ${lewdmessage[2]}`,
                description: lewdmessage[0],
                timestamp: time,
                footer: {
                    text: `${usage} response`,
                    icon_url: mentioned.avatarURL
                }
            }
        };
        Bot.createMessage(m.channel.id, data);
        return;


    },
    help: "A Gentle smush"
};
