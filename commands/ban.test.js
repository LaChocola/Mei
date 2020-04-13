"use strict";

const ban = require("./ban");
const serversdb = require("../servers");

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
 *
 * # Roles
 * ModRole: Code Monkey (658900877956087808)
 */

function buildArgs(command, args, prefix) {
    if (!args) {
        args = "";
    }
    if (!prefix) {
        prefix = "!";
    }

    var bot = {
        users: {
            get: jest.fn().mockName("get").mockResolvedValue({
                fullname: "Pete Smith#1234"
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
}

jest.mock("../servers");

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
serversdb.save.mockResolvedValue();

test("!ban", async function() {
    var { bot, m, args, prefix } = buildArgs("ban");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please provide an id or mention to ban a user", 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).not.toHaveBeenCalled();
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] as owner", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Natalie");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] | reason as owner", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858 | Because I wanted to");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [@mention] as owner", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "<@!435088936730361858>");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";
    m.mentions = [{ id: "435088936730361858" }];

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Natalie");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban undo [id] as owner", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "undo 435088936730361858");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";
    m.mentions = [{ id: "435088936730361858" }];

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).not.toHaveBeenCalled();
    expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Natalie");
});

test("!ban [id] as mod", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "DigiDuncan";
    m.member.id = "271803699095928832";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: DigiDuncan");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] as modRole", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "Kelly";
    m.member.id = "236336628828733443";
    m.member.roles = ["658900877956087808"];

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Kelly");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] as Chocola", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "Chocola";
    m.member.id = "161027274764713984";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Chocola");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] with administrator permission", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "Rel";
    m.member.id = "338386561572012032";
    m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Rel");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] with banMembers permission", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "Arceus";
    m.member.id = "239598274103738369";
    m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Arceus");
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

test("!ban [id] as unauthorized user", async function() {
    var { bot, m, args, prefix } = buildArgs("ban", "435088936730361858");
    m.member.name = "AWK";
    m.member.id = "236223047093321728";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villan\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).not.toHaveBeenCalled();
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

