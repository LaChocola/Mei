"use strict";

function wrapJoin(items, sep, maxLen) {
    if (sep === undefined) {
        sep = ",";
    }
    if (maxLen === undefined) {
        maxLen = 80;
    }

    var lines = [];
    var line = "";

    for (let i = 0; i < items.length; i++) {
        // don't add a separator if this is the last item
        var isLast = i === items.length - 1;
        var item = items[i];
        if (!isLast) {
            item += sep;
        }

        // too many characters, time to go to the next line
        // if line is empty, ignore max line length
        if (line.length > 0 && line.length + item.length > maxLen) {
            lines.push(line);
            line = "";
        }

        line += item;
    }

    // If the last line has content, push it into the array
    if (line) {
        lines.push(line);
    }

    // Join all the lines
    return lines.join("\n");
}

module.exports = wrapJoin;
