"use strict";

var getStory = jest.fn().mockName("getStory").mockResolvedValue("STORY");

module.exports = getStory;
