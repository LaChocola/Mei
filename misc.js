"use strict";

const ids = require("./ids");
const serversdb = require("./servers");

const escapeStringRegexp = require("escape-string-regexp");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Misc functions
function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function chooseHand() {
    var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
    return choose(hands);
}

function chunkArray(arr, chunkSize) {
    var chunkCount = Math.ceil(arr.length / chunkSize);
    // eslint-disable-next-line no-unused-vars
    return Array(chunkCount).fill().map(function(_, index) {
        var begin = index * chunkSize;
        return arr.slice(begin, begin + chunkSize);
    });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function chooseMember(members) {
    var choices = members.filter(m =>
        !m.bot
        && m.status !== "offline");

    var member = choose(choices);

    return member && member.id;
}

// Find the id of a mentioned user
function getMentionedId(m, args) {
    var mentionedId = m.mentions[0] && m.mentions[0].id;
    if (mentionedId) {
        return mentionedId;
    }

    var member = m.guild.members.find(function(mbr) {
        return new RegExp("\\b" + escapeStringRegexp(mbr.username) + "\\b", "i").test(args)
            || (mbr.nick && new RegExp("\\b" + escapeStringRegexp(mbr.nick) + "\\b", "i").test(args));
    });
    if (member) {
        return member.id;
    }

    return undefined;
}

function isObject(value) {
    return value && typeof value === "object" && value.constructor === Object;
}

function isString(value) {
    return typeof value === "string" || value instanceof String;
}

function isNum(num) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
}

function toNum(num) {
    if (!isNum(num)) {
        return NaN;
    }
    return Number(num);
}

// Because javascript bit-wise operations are limited to 32 bits :P
function leftShift(n, s) {
    return n * (2 ** s);
}

function timestampToSnowflake(d) {
    var epoch = 1421280000000;
    var dateFieldOffset = 22;
    var snowflake = leftShift(d - epoch, dateFieldOffset);
    return snowflake;
}

function splitArray(arr, predicate) {
    var trueArr = [];
    var falseArr = [];
    arr.forEach(function(i) {
        if (predicate(i)) {
            trueArr.push(i);
        }
        else {
            falseArr.push(i);
        }
    });
    return [trueArr, falseArr];
}

function deleteIn(timeout) {
    return async function(sentMsg) {
        await delay(timeout);
        sentMsg.delete("Timeout");
    };
}

async function updateGuild(m, guildsdata) {
    var changed = false;

    // Add guild if missing
    if (!guildsdata[m.guild.id]) {
        guildsdata[m.guild.id] = {
            name: m.guild.name,
            owner: m.guild.ownerID
        };
        m.reply(`Server: ${m.guild.name} added to database. Populating information ${chooseHand()}`, 5000);
        m.deleteIn(5000);
        changed = true;
    }

    var guildData = guildsdata[m.guild.id];

    // Update guild owner, if changed
    if (guildData.owner !== m.guild.ownerID) {
        m.reply("New server owner detected, updating database.", 5000);
        guildData.owner = m.guild.ownerID;
        changed = true;
    }

    // Update guild name, if changed
    if (guildData.name !== m.guild.name) {
        m.reply("New server name detected, updating database.", 5000);
        guildData.name = m.guild.name;
        changed = true;
    }

    // Save any changes
    if (changed) {
        await serversdb.save(guildsdata);
    }
}

function hasSomePerms(member, permlist) {
    var hasPerm = permlist.some(function(perm) {
        return member.permission.has(perm);
    });
    return hasPerm;
}

function isMod(member, guild, guilddata) {
    if (!guilddata) {
        guilddata = {};
    }

    // member is owner
    if (member.id === guild.ownerID) {
        return true;
    }

    // member is chocola
    if (member.id === ids.users.chocola) {
        return true;
    }

    // member is mod
    var guildmods = guilddata.mods && Object.keys(guilddata.mods) || [];
    if (guildmods.includes(member.id)) {
        return true;
    }

    // member has mod role
    var guildmodroles = guilddata.modRoles && Object.keys(guilddata.modRoles) || [];
    var memberroles = member.roles;
    var hasmodrole = guildmodroles.some(function(modrole) {
        return memberroles.includes(modrole);
    });
    if (hasmodrole) {
        return true;
    }

    // member is not a mod
    return false;
}

module.exports = {
    choose,
    chooseHand,
    chunkArray,
    capitalize,
    chooseMember,
    getMentionedId,
    isObject,
    isString,
    isNum,
    toNum,
    leftShift,
    timestampToSnowflake,
    splitArray,
    delay,
    deleteIn,
    updateGuild,
    hasSomePerms,
    isMod
};
