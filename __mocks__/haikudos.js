"use strict";

const Haikudos = jest.genMockFromModule("Haikudos");

Haikudos.mockImplementation(cb => cb("THIS IS NOT A HAIKU"));

module.exports = Haikudos;
