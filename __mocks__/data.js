"use strict";

const datadb = jest.genMockFromModule("../data");

datadb.load.mockResolvedValue({
    commands: {
        "g": {
            users: {
                "161027274764713984": 100
            }
        },
        "v": {
            users: {
                "161027274764713984": 100
            }
        },
        "tf": {
            users: {
                "161027274764713984": 100
            }
        }
    }
});

module.exports = datadb;
