"use strict";

const getStory = require("../getStory");

const command = "v";
const type = "violent";
const isNSFW = true;
const responseColor = 0xA260F6;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var story = await getStory(m, args, command, type, isNSFW, responseColor);
        Bot.createMessage(m.channel.id, story);
    },
    help: "A Violent Smush"
};
