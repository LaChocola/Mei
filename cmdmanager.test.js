"use strict";

const cmdmanager = require("./cmdmanager");

test("cmdmanager.loadAll()", async function() {
    expect(() => {
        cmdmanager.loadAll();
    }).not.toThrow();
});

test("cmdmanager.list()", async function() {
    cmdmanager.loadAll();
    var commands = cmdmanager.list();
    expect(commands).toEqual([
        "8ball", "aesthetics", "allroles", "art", "artist", "avy", "ban", "beautiful", "booru", "c", "cat", "choose", "clean",
        "commands", "complaint", "d", "date", "dog", "e", "edit", "embed", "emojify", "eval", "ex", "fetish", "furry", "g",
        "giveaway", "haiku", "help", "hoard", "ignore", "invite", "leaderboard", "markov", "names", "pat", "ping", "play", "role",
        "roles", "sauce", "say", "search", "ship", "spray", "stats", "suggest", "tcg", "tf", "uptime", "urban", "v", "wish"
    ]);
});
