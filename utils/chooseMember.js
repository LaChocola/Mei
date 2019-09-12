"use strict";

var choose = require("../utils/choose");

function chooseMember(members) {
    members = members.filter(m => !m.bot);
    members = members.filter(m => m.status !== "offline");
    return choose(members);
}

module.exports = chooseMember;
