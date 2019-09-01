"use strict";

var skinTones = [
    ":skin-tone-1:",
    ":skin-tone-2:",
    ":skin-tone-3:",
    ":skin-tone-4:",
    ":skin-tone-5:",
    ""
];

var emojis = [
    ok: ":ok_hand:",
    wave: ":wave:"
];

function pick(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function hand(emojiName) {
    var emoji = hands[emojiName];
    if (!emoji) {
        return "";
    }
    return emoji + pick(skinTones);
}

module.exports = {
    ok: () => hand("ok"),
    wave: () => hand("wave")
};
