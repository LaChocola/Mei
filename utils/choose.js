"use strict";

const _ = require("lodash");

function choose(options, count) {
    return options[_.random(0, options.length - 1)];
}

module.exports = choose;
