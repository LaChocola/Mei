"use strict";

function parse(m, prefix) {
    var content = m.content.replace(/<@!/g, "<@");
    if (!content.startsWith(prefix)) {
        return;
    }
    var args = content.substring(prefix.length).trim().split(/\s+/g);
    var label = args.shift();

    var command = {
        label: label
    };

    m.prefix = prefix;
    m.command = command;
    return args;
}

module.exports = {
    parse
};
