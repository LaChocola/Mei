"use strict";

const _ = require("lodash");

function chooseMany(options, count) {
    options = options.slice();  // Shallow copy the array to avoid mutating it
    if (!count) {
        count = options.length;
    }
    if (count > options.length) {
        count = options.length;
    }

    var chosen = [];
    for (let i = 0; i < count; i++) {
        var index = _.random(0, options.length - 1);
        chosen.push(options.splice(index, 1)[0]);
    }
    return chosen;
}

module.exports = chooseMany;
