"use strict";

/*
 * # Users
 * Server owner: Natalie (137269976255037440)
 * Mod: DigiDuncan (271803699095928832)
 * ModRole: Kelly (236336628828733443)
 * Chocola: Chocola (161027274764713984)
 * administrator permission: Rel (338386561572012032)
 * banMembers permission: Arceus (239598274103738369)
 * Unauthorized User: AWK (236223047093321728)
 * Target: Pete Smith (435088936730361858)
 * Second Target: Nelly (310836984388124672)
 *
 * # Roles
 * ModRole: Code Monkey (658900877956087808)
 */

global.setupCmd = function(command, args) {
    var prefix = "!";
    args = args || "";

    var bot = {
        users: {
            get: jest.fn().mockName("get").mockImplementation(function(id) {
                if (id === "435088936730361858") {
                    return { fullname: "Pete Smith#1234" };
                }
                else if (id === "310836984388124672") {
                    return { fullname: "Nelly#5678" };
                }
                else {
                    return undefined;
                }
            })
        }
    };

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
            name: "Natalie",
            id: "137269976255037440",
            roles: [],
            permission: {
                has: jest.fn().mockName("has").mockReturnValue(false)
            }
        },
        deleteIn: jest.fn().mockName("deleteIn").mockResolvedValue(),
        content: `${prefix}${command} ${args}`.trim(),
        mentions: []
    };

    return { bot, m, args, prefix };
};
