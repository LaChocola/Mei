"use strict";

function choose(options) {
    return options[Math.floor(Math.random() * options.length)];
}

module.exports = choose;
