"use strict";

const getStory = require("../getStory");

const command = "tf";
const type = "tf";
const responseColor = 0x00FF8F;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var story = await getStory(m, args, command, type, responseColor);
        m.reply(story);
    },
    help: "A TF responses",
    nsfw: true
};
