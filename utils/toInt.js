"use strict";

const isNum = require("./isNum");

module.exports = function(num) {
    if (!isNum(num)) {
        return NaN;
    }
    return Math.trunc(Number(num));
};
