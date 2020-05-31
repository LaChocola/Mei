"use strict";

/**
 * Misc utilities module
 * @module misc
 */

const escapeStringRegexp = require("escape-string-regexp");

const ids = require("./ids");
const serversdb = require("./servers");

/**
 * Return a promise that resolves after a delay in milliseconds
 * @memberof module:misc
 * @function
 * @param {number} ms Delay in milliseconds
 * @returns {Promise}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Choose a random option from an array of options
 * @memberof module:misc
 * @function
 * @param {Array} arr Array of options to choose from
 * @returns {any}
 */
function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Choose a hand emoji with a random skin-tone
 * @memberof module:misc
 * @function
 * @returns {String}
 */
function chooseHand() {
    var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
    return misc.choose(hands);
}

/**
 * Split an array into even sized chunks
 * @memberof module:misc
 * @function
 * @param {Array} arr
 * @param {Number} chunkSize
 * @returns {Array.<Array>}
 */
function chunkArray(arr, chunkSize) {
    var chunkCount = Math.ceil(arr.length / chunkSize);
    // eslint-disable-next-line no-unused-vars
    return Array(chunkCount).fill().map(function(_, index) {
        var begin = index * chunkSize;
        return arr.slice(begin, begin + chunkSize);
    });
}

/**
 * @memberof module:misc
 * @function
 * @returns {String}
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Member}
 */
function chooseMember(members) {
    var choices = members.filter(m =>
        !m.bot
        && m.status !== "offline");

    var member = misc.choose(choices);

    return member && member.id;
};

// 
/**
 * Find the id of a mentioned user
 * @memberof module:misc
 * @function
 * @returns {String}
 */
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
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Boolean}
 */
function isObject(value) {
    return value && typeof value === "object" && value.constructor === Object;
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Boolean}
 */
function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * 
 * @function
 * @returns {Boolean}
 */
function isNum(num) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Number}
 */
function toNum(num) {
    if (!misc.isNum(num)) {
        return NaN;
    }
    return Number(num);
};

/**
 * Because javascript bit-wise operations are limited to 32 bits :P
 * @memberof module:misc
 * @function
 * @returns {Number}
 */
function leftShift(n, s) {
    return n * (2 ** s);
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Number}
 */
function timestampToSnowflake(t) {
    var epoch = 1420070400000;
    var dateFieldOffset = 22;
    var snowflake = misc.leftShift(t - epoch, dateFieldOffset);
    return snowflake;
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Array.<Array>}
 */
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
};

/**
 * 
 * @memberof module:misc
 * @function
 * @returns {Promise}
 */
function deleteIn(timeout) {
    return async function(sentMsg) {
        await misc.delay(timeout);
        sentMsg.delete("Timeout");
    };
};

/**
 * Update guild data if it has changed
 * @memberof module:misc
 * @function
 * @param {Eris.Channel} channel
 * @param {Object} guildsdata
 */
async function updateGuild(channel, guild, guildsdata) {
    var changed = false;

    // Add guild if missing
    if (!guildsdata[guild.id]) {
        guildsdata[guild.id] = {
            name: guild.name,
            owner: guild.ownerID
        };
        await channel.send(`Server: ${guild.name} added to database. Populating information ${misc.chooseHand()}`, 5000);
        changed = true;
    }

    var guilddata = guildsdata[guild.id];

    // Update guild owner, if changed
    if (guilddata.owner !== guild.ownerID) {
        await channel.send("New server owner detected, updating database.", 5000);
        guilddata.owner = guild.ownerID;
        changed = true;
    }

    // Update guild name, if changed
    if (guilddata.name !== guild.name) {
        await channel.send("New server name detected, updating database.", 5000);
        guilddata.name = guild.name;
        changed = true;
    }

    // Save any changes
    if (changed) {
        await serversdb.save(guildsdata);
    }
};

/**
 * Check if a member has at least on of the specified permissions
 * @memberof module:misc
 * @function
 * @param {Eris.Member} member
 * @param {Array.<String>} permlist
 * @returns {Boolean}
 */
function hasSomePerms(member, permlist) {
    var hasPerm = permlist.some(function(perm) {
        return member.permission.has(perm);
    });
    return hasPerm;
};

/**
 * Check if a member is has mod privileges in a guild
 * @memberof module:misc
 * @function
 * @param {Eris.Member} member
 * @param {Eris.Guild} guild
 * @param {Object} guilddata
 * @returns {Boolean}
 */
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
};

/**
 * Return a copy of an array with all duplicate values removed
 * @memberof module:misc
 * @function
 * @param {Array} items
 * @returns {Array}
 */
function unique(items) {
    return [...new Set(items)];
};

/**
 * Split a string by spaces, up to a limit number of times
 * @memberof module:misc
 * @function
 * @param {String} s String to split
 * @param {String} [limit] Number of times to split the string, defaults to unlimited
 * @returns {String}
 */
function splitBySpace(s, limit) {
    s = s.trim();
    var parts;
    if (!limit) {
        parts = s.split(/\s+/);
    }
    else {
        parts = [];
        for (var i = 0; i < limit; i++) {
            var part = s.split(/\s+/, 1)[0];
            s = s.slice(part.length).trim();
            parts.push(part);
        }
        parts.push(s);
    }
    return parts;
}

var misc = module.exports = {
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
    isMod,
    unique,
    splitBySpace
};
