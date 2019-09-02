"use strict";

function getRoleName(role) {
    var name;
    if (typeof role === "string") {
        name = role;
    }
    else {
        name = role.name;
    }
    name = name.trim().toLowerCase();
    return name;
}

function isSameRole(role1, role2) {
    if (!(role1 && role1)) {
        return false;
    }
    var roleName1 = getRoleName(role1);
    var roleName2 = getRoleName(role2);
    return roleName1 === roleName2;
}

module.exports = isSameRole;
