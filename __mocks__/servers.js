"use strict";

const serversdb = jest.genMockFromModule("../servers");

serversdb.load.mockResolvedValue({
    "161027274764713984": {
        name: "SizeDev",
        owner: "137269976255037440",
        mods: {
            "271803699095928832": true
        },
        modRoles: {
            "658900877956087808": true
        }
    }
});

module.exports = serversdb;
