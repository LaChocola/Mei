"use strict";

const getStory = require("../getStory");

const command = "tf";
const type = "tf";
const isNSFW = true;
const responseColor = 0x00FF8F;

module.exports = {
	main: async function (Bot, m, args, prefix) {
		var story = await getStory(m, args, command, type, isNSFW, responseColor);
		Bot.createMessage(m.channel.id, story);
	},
	help: "A TF responses"
};
