"use strict";

const Haikudos = jest.genMockFromModule("haikudos");

Haikudos.mockImplementation(cb => cb("THIS IS NOT A HAIKU"));

module.exports = Haikudos;
