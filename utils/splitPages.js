"use strict";

// format lines into pages of a maximum size
function splitPages(s, limit) {
    if (s === "") {
        return [];
    }

    var lines = s.split("\n");

    // Initialize first page with first line (limited to [limit] characters)
    var pages = [lines.shift().slice(0, limit)];

    lines.forEach(function(line) {
        // Limit each line to [limit] characters
        line = line.slice(0, limit);
        var appended = pages[pages.length - 1] + "\n" + line;
        if (appended.length <= limit) {
            // If appending the command help doesn't go past the page limit, then just append to the current page
            pages[pages.length - 1] = appended;
        }
        else {
            // Otherwise, start a new page
            pages.push(line);
        }
    });

    return pages;
}

module.exports = splitPages;
