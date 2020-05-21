"use strict";

const randomPuppy = jest.genMockFromModule("random-puppy");

randomPuppy.mockResolvedValue("https://dogs.com/dogs.jpg");

module.exports = randomPuppy;
