"use strict";

// Searches for member names in the command arguments, and adds their user objects to the m.mentions array
function parseNameMentions(m, sep) {
    if (!sep) {
        sep = " ";
    }

    var names = m.fullArgs.split(sep);
    // Ignore an empty string from split ("".split(" | ") === [""])
    if (names.length === 1 && names[0] === "") {
        names = [];
    }
    names = names
        .map(name => parseName(name))
        .filter(name => name);

    var members = names.map(function(name) {
        return m.guild.members.find(m => m.name.toLowerCase().trim() === name);
    });

    members.forEach(function(member) {
        var alreadyMentioned = m.mentions.some(u => u.id === member.id);
        if (!alreadyMentioned) {
            m.mentions.push(member.user);
        }
    });
}

function parseName(s) {
    if (!s) {
        return;
    }
    if (s.startsWith("@")) {
        s = s.slice(1);
    }
    s = s.toLowerCase().trim();
    return s;
}

module.exports = parseNameMentions;
