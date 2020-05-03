"use strict";

const misc = require("./misc");

test.each`
t                | expected
${1588037318713} | ${704504319025610752}
${1546318800000} | ${529524169113600000}
${1529771696000} | ${460120584617984000}
`("timestampToSnowflake $t", function({t, expected}) {
    var s = misc.timestampToSnowflake(t);
    expect(s).toBe(expected);
});

test.each`
n    | s     | expected
${1} | ${1}  | ${2}
${1} | ${2}  | ${4}
${1} | ${10} | ${1024}
${1} | ${20} | ${1048576}
${1} | ${22} | ${4194304}
${1} | ${32} | ${4294967296}
`("leftShift $n $s", function({n, s, expected}) {
    var result = misc.leftShift(n, s);
    expect(result).toBe(expected);
});

test("listCommands", async function() {
    var commands = await misc.listCommands();
    expect(commands).toEqual([
        "8ball", "aesthetics", "allroles", "art", "artist", "avy", "ban", "beautiful", "booru", "c", "cat", "choose", "clean",
        "commands", "complaint", "d", "date", "dog", "e", "edit", "embed", "emojify", "eval", "ex", "fetish", "furry", "g",
        "giveaway", "haiku", "help", "hoard", "ignore", "invite", "leaderboard", "markov", "names", "pat", "ping", "play", "role",
        "roles", "sauce", "say", "search", "ship", "spray", "stats", "suggest", "tcg", "tf", "uptime", "urban", "v", "wish"
    ]);
});
