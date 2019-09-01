"use strict";

var hands = [
    ":ok_hand::skin-tone-1:",
    ":ok_hand::skin-tone-2:",
    ":ok_hand::skin-tone-3:",
    ":ok_hand::skin-tone-4:",
    ":ok_hand::skin-tone-5:",
    ":ok_hand:"
];

function hand() {
    return hands[Math.floor(Math.random() * hands.length)];
}

module.exports = hand;
