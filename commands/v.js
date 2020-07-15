"use strict";

const getStory = require("../getStory");

const command = "v";
const type = "violent";
const responseColor = 0xA260F6;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var story = await getStory(m, args, command, type, responseColor);
        m.reply(story);
    },
    help: "A Violent Smush",
    nsfw: true
};
