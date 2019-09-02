"use strict";

const isNum = require("./isNum");

module.exports = function(num) {
    if (!isNum(num)) {
        return NaN;
    }
    return Number(num);
};
