"use strict";

const eightball = jest.genMockFromModule("8ball");

eightball.mockReturnValue("it is certain");

module.exports = eightball;
