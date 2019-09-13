"use strict";

function split(s, sep) {
    if (sep === undefined) {
        sep = " ";
    }

    var parts = s.split(sep);
    if (parts.length === 1 && parts[0] === "") {
        parts = [];
    }

    return parts;
}

module.exports = split;
