"use strict";

const escapeStringRegexp = require("escape-string-regexp");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Misc functions
function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

module.exports = {
    choose,
    chunkArray,
    capitalize,
    chooseMember,
    getMentionedId,
    isNum,
    toNum,
    leftShift,
    timestampToSnowflake,
    splitArray,
    delay,
    deleteIn
};
