"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const conf = require("../conf");
const utils = require("../utils");
const _ = require("../servers");

var data = _.load();

var permissionDeniedResponses = [
    "Are you a real villan?",
    "Have you ever caught a good guy? \nLike a real super hero?",
    "Have you ever tried a disguise?",
    "What are you doing?!?!?!",
    "*NO!*, Don't touch that!",
    "Fuck Off",
    "Roses are red\nfuck me ;) "
];

async function checkIsMod(member, guild) {
    var guildData = data[guild.id];
    if (!guildData) {
        var perms = member.permission.json;
        return perms.banMembers || perms.administrator || perms.manageGuild;
    }

    if (guildData.owner !== guild.ownerID) {
        //m.reply("New server owner detected, updating database.", 5000);
        guildData.owner = guild.ownerID;
        _.save(data);
        _.load();
    }

    if (guildData.mods) {
        if (guildData.mods[member.id]) {
            return true;
        }
    }
    if (member.id === guildData.owner || member.id === guild.ownerID) {
        return true;
    }
    if (guildData.modRoles) {
        var memberRoles = member.roles;
        var mod = false;
        for (let role of memberRoles) {
            if (guildData.modRoles[role]) {
                mod = true;
            }
        }
        if (mod) {
            return true;
        }
    }
}

var meta = {
    name: "ban",
    args: "[undo] user [| user] ...",
    help: "Ban someone..."
};

meta.main = async function(bot, m, args, prefix) {
    var guild = m.channel.guild;
    var authorMember = guild.members.get(m.author.id);

    var isMod = await checkIsMod(authorMember, guild);

    if (!isMod && authorMember.id !== conf.users.owner) {
        var permissionDeniedResponse = permissionDeniedResponses[Math.floor(Math.random() * permissionDeniedResponses.length)];
        m.reply(permissionDeniedResponse, 5000);
        m.deleteIn(5000);
        return;
    }

    var undo = false;
    var guardian = authorMember.nick || authorMember.username;

    args = args.split(" ");
    if (args.indexOf("undo") > -1) {
        undo = true;
    }
    var args2 = m.content.replace(RegExp("^\\s*" + escapeStringRegexp(prefix + meta.name)), "").replace(/\bundo\b/, "").split(" | ");
    var reason = args2[1] || `Banned by: ${guardian}`;
    console.log(args2);

    var mentionedIds = m.mentions.map(u => u.id);

    var targets = mentionedIds || args2;
    var name;

    targets.forEach(async function(targetId) {
        targetId = targetId.replace("<@", "").replace(">", "").trim();
        // TODO: name is undeclared here?
        if (!name || m.mentions.length < 2) {
            var target = await bot.users.get(targetId);
            if (!target || !target.username) {
                name = "Unknown User";
                return;
            }
            name = target.username;
        }

        if (undo) {
            try {
                await guild.unbanMember(targetId, "Unbanned by: " + guardian);
                let successMessage = `${utils.hands.ok()} Successful unbanned: ${name} (${targetId})`;
                m.reply(successMessage, 5000);
            }
            catch (err) {
                if (err.code == 50013) {
                    if (targetId === guild.ownerID) {
                        m.reply("Uhm, think about what you just tried to do...", 5000);
                    }
                    else {
                        m.reply("I do not have permisson to unban that user. Please make sure I have the `Ban Member` permission", 5000);
                    }
                    return;
                }

                console.log(err);
                m.reply("Something went wrong while trying to unban that member", 5000);
            }
        }
        else {
            if (targetId || name != guardian) {
                try {
                    await guild.banMember(targetId, 0, reason);
                    let successMessage = `${utils.hands.ok()} Successful banned: ${name} (${targetId})`;
                    m.reply(successMessage, 5000);
                }
                catch (err) {
                    if (err.code == 50013) {
                        if (targetId === guild.ownerID) {
                            m.reply("I can not ban the owner of the server, sorry.", 5000);
                        }
                        else {
                            m.reply("I do not have permisson to ban that user. Please make sure I have the `Ban Member` permission, and that my highest role is above theirs", 5000);
                        }
                        return;
                    }

                    console.log(err);
                    m.reply("Something went wrong while trying to ban that member", 5000);
                }
            }
            else {
                m.reply("I tried...", 5000);
            }
        }
    });
    m.delete("Timeout");
};

module.exports = meta;
