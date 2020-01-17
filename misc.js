"use strict";

// Misc functions
function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function chunkArray(arr, chunkSize) {
    var chunkCount = Math.ceil(arr.length / chunkSize);
    return Array(chunkCount).fill().map(function (_, index) {
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
        && m.status !== "offline"
        && m.user.id !== "309220487957839872");

    var member = choose(choices);

    return member && member.id;
}

function getMentionedId(m, args) {
    var guildMembers = m.guild.members;
    var member = guildMembers.find(mbr => (mbr.nick || mbr.username).toLowerCase() === args);
    var mentionedId = (member || m.mentions[0]).id;
    return mentionedId;
}

module.exports = {
    choose,
    chunkArray,
    capitalize,
    chooseMember,
    getMentionedId
};
