"use strict";

const misc = jest.genMockFromModule("../misc");
const orig = jest.requireActual("../misc");

// Mock command functions
misc.listCommands.mockResolvedValue(["8ball", "aesthetics", "allroles", "art"]);
misc.quickloadCommand.mockImplementation(function(name) {
    if (name === "8ball") {
        return {
            name: "8ball",
            help: "[prefix]8ball help string",
            hidden: false
        };
    }
    if (name === "aesthetics") {
        return {
            name: "aesthetics",
            help: "[prefix]aesthetics help string",
            hidden: false
        };
    }
    if (name === "allroles") {
        return {
            name: "allroles",
            help: "[prefix]allroles help string",
            hidden: true
        };
    }
    if (name === "art") {
        return {
            name: "art",
            help: "[prefix]art help string",
            hidden: false
        };
    }
    var err = new Error();
    err.code = "MODULE_NOT_FOUND";
    throw err;
});

// Mock function that use randomness with consistent results
misc.choose.mockImplementation(function(arr) {
    return arr[0];
});
misc.chooseHand.mockReturnValue(":ok_hand::skin-tone-5:");

// Disable delay for speed
misc.delay.mockResolvedValue();

// Keep the original module, but override the mocked functions
module.exports = {
    ...orig,
    listCommands: misc.listCommands,
    quickloadCommand: misc.quickloadCommand,
    choose: misc.choose,
    chooseHand: misc.chooseHand,
    delay: misc.delay
};
