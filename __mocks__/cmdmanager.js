"use strict";

const cmdmanager = jest.genMockFromModule("../cmdmanager");

var commands = [
    {
        name: "8ball",
        help: "[prefix]8ball help string",
        hidden: false
    },
    {
        name: "aesthetics",
        help: "[prefix]aesthetics help string",
        hidden: false
    },
    {
        name: "allroles",
        help: "[prefix]allroles help string",
        hidden: true
    },
    {
        name: "art",
        help: "[prefix]art help string",
        hidden: false
    }
];

// Mock command functions
cmdmanager.list.mockReturnValue(commands.map(c => c.name));
cmdmanager.get.mockImplementation(function(name) {
    var command = commands.find(c => c.name === name);
    if (!command) {
        var err = new Error();
        err.code = "MODULE_NOT_FOUND";
        throw err;
    }
    return command;
});
cmdmanager.getAll.mockReturnValue(commands);

// Keep the original module, but override the mocked functions
module.exports = cmdmanager;
