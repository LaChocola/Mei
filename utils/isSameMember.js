"use strict";

function getNick(member) {
    var nick;
    if (typeof member === "string") {
        nick = member;
    }
    else {
        nick = member.nick || member.username;
    }
    nick = nick.trim().toLowerCase();
    return nick;
}

function isSameMember(member1, member2) {
    if (!(member1 && member2)) {
        return false;
    }
    var nick1 = getNick(member1);
    var nick2 = getNick(member2);
    return nick1 === nick2;
}

module.exports = isSameMember;
