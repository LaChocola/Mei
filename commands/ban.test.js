"use strict";

const ban = require("./ban");
const serversdb = require("../servers");

function getbot(options) {
    if (!options) {
        options = {};
    }

    var bot = {
        users: {
            get: jest.fn().mockName("get").mockResolvedValue({
                // Fake user here
            })
        }
    };

    return bot;
}

function getm(options) {
    if (!options) {
        options = {};
    }

    var m = {
        guild: {
            id: "161027274764713984",
            name: "SizeDev",
            ownerID: "137269976255037440",
            banMember: jest.fn().mockName("banMember").mockResolvedValue(),
            unbanMember: jest.fn().mockName("unbanMember").mockResolvedValue()
        },
        reply: jest.fn().mockName("reply").mockResolvedValue(),
        member: {
            id: "137269976255037440",
            roles: [],
            permission: {
                has: jest.fn().mockName("has").mockImplementation(function(perm) {
                    return true;
                })
            }
        },
        deleteIn: jest.fn().mockName("deleteIn").mockResolvedValue(),
        content: "",
        mentions: []
    };

    return m;
}

jest.mock("../servers");

serversdb.load.mockResolvedValue({
    "161027274764713984": {
        name: "SizeDev",
        owner: "137269976255037440",
        mods: {},
        modRoles: {}
    }
});
serversdb.save.mockResolvedValue();

test(".ban", async function() {
    var bot = getbot();
    var m = getm();
    var args = "";
    var prefix = ".";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please provide an id or mention to ban a user", 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).not.toHaveBeenCalled();
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});
