"use strict";

// Shamelessly stolen from is-number <https://github.com/jonschlinkert/is-number>

module.exports = function(num) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
};
