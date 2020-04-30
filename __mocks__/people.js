"use strict";

const peopledb = jest.genMockFromModule("../people");

peopledb.load.mockResolvedValue({
    people: {
        "161027274764713984": {
        }
    }
});

module.exports = peopledb;
