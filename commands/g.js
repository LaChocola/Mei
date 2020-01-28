"use strict";

const getStory = require("../getStory");

const command = "g";
const type = "gentle";
const isNSFW = false;
const responseColor = 0xFF00DC;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var story = await getStory(m, args, command, type, isNSFW, responseColor);
        Bot.createMessage(m.channel.id, story);
    },
    help: "A Gentle smush"
};
