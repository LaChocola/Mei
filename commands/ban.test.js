"use strict";

const ban = require("./ban");

jest.mock("../servers");

test("!ban", async function() {
    var { bot, m, args, prefix } = setupCmd("ban");
    m.member.name = "Natalie";
    m.member.id = "137269976255037440";

    await ban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please provide an id or mention to ban a user", 5000);
    expect(m.deleteIn).toBeCalledWith(5000);
    expect(m.guild.banMember).not.toHaveBeenCalled();
    expect(m.guild.unbanMember).not.toHaveBeenCalled();
});

describe("Banning as owner", function() {
    test("!ban [id] as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Natalie");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Natalie");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] as owner with missing permissions", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.guild.banMember.mockImplementationOnce(async function() {
            throw { code: 50013 };
        });

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith("I do not have permission to ban that user. Please make sure I have the `Ban Member` permission, and that my highest role is above theirs", 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Natalie");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] [id] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 310836984388124672 | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Nelly#5678 \(310836984388124672\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.banMember).toBeCalledWith("310836984388124672", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as mod", function() {
    test("!ban [id] as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: DigiDuncan");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: DigiDuncan");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as someone with a modRole", function() {
    test("!ban [id] as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Kelly");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Kelly");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as Chocola", function() {
    test("!ban [id] as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Chocola");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Chocola");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as someone with administrator permission", function() {
    test("!ban [id] with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Rel");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.mentions = [{ id: "435088936730361858" }];
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Rel");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.mentions = [{ id: "435088936730361858" }];
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as someone with banMembers permission", function() {
    test("!ban [id] with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Arceus");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Because I wanted to");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858>");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Banned by: Arceus");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Because I wanted to");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully banned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).toBeCalledWith("435088936730361858", 0, "Because I wanted to");
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Banning as unauthorized user", function() {
    test("!ban [id] as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [id] | reason as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "435088936730361858 | Please let me in");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Please let me in");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban [@mention] | reason as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "<@!435088936730361858> | Please let me in");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});

describe("Unbanning as owner", function() {
    test("!ban undo [id] as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Natalie");
    });

    test("!ban undo [id] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Natalie");
    });

    test("!ban undo [@mention] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [id] as owner with missing permissions", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";
        m.mentions = [{ id: "435088936730361858" }];
        m.guild.unbanMember.mockImplementationOnce(async function() {
            throw { code: 50013 };
        });

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith("I do not have permission to unban that user. Please make sure I have the `Ban Member` permission", 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Natalie");
    });

    test("!ban undo [id] [id] | reason as owner", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 310836984388124672 | Because I wanted to");
        m.member.name = "Natalie";
        m.member.id = "137269976255037440";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Nelly#5678 \(310836984388124672\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
        expect(m.guild.unbanMember).toBeCalledWith("310836984388124672", "Because I wanted to");
    });
});

describe("Unbanning as mod", function() {
    test("!ban undo [id] as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: DigiDuncan");
    });

    test("!ban undo [id] | reason as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: DigiDuncan");
    });

    test("!ban undo [@mention] | reason as mod", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "DigiDuncan";
        m.member.id = "271803699095928832";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });
});

describe("Unbanning as someone with a modRole", function() {
    test("!ban undo [id] as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Kelly");
    });

    test("!ban undo [id] | reason as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Kelly");
    });

    test("!ban undo [@mention] | reason as modRole", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "Kelly";
        m.member.id = "236336628828733443";
        m.member.roles = ["658900877956087808"];
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });
});

describe("Unbanning as Chocola", function() {
    test("!ban undo [id] as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Chocola");
    });

    test("!ban undo [id] | reason as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Chocola");
    });

    test("!ban undo [@mention] | reason as Chocola", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "Chocola";
        m.member.id = "161027274764713984";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });
});

describe("Unbanning as someone with administrator permission", function() {
    test("!ban undo [id] with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Rel");
    });

    test("!ban undo [id] | reason with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.mentions = [{ id: "435088936730361858" }];
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Rel");
    });

    test("!ban undo [@mention] | reason with administrator permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "Rel";
        m.member.id = "338386561572012032";
        m.mentions = [{ id: "435088936730361858" }];
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "administrator");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });
});

describe("Unbanning as someone with banMembers permission", function() {
    test("!ban undo [id] with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Arceus");
    });

    test("!ban undo [id] | reason with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Because I wanted to");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });

    test("!ban undo [@mention] with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Unbanned by: Arceus");
    });

    test("!ban undo [@mention] | reason with banMembers permission", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Because I wanted to");
        m.member.name = "Arceus";
        m.member.id = "239598274103738369";
        m.member.permission.has = jest.fn().mockName("has").mockImplementation(perm => perm === "banMembers");
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/:ok_hand:(:skin-tone-1:|:skin-tone-2:|:skin-tone-3:|:skin-tone-4:|:skin-tone-5:|) Successfully unbanned: Pete Smith#1234 \(435088936730361858\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).toBeCalledWith("435088936730361858", "Because I wanted to");
    });
});

describe("Unbanning as unauthorized user", function() {
    test("!ban undo [id] as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban undo [id] | reason as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo 435088936730361858 | Please let me in");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban undo [@mention] unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858>");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";
        m.mentions = [{ id: "435088936730361858" }];

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });

    test("!ban undo [@mention] | reason as unauthorized user", async function() {
        var { bot, m, args, prefix } = setupCmd("ban", "undo <@!435088936730361858> | Please let me in");
        m.member.name = "AWK";
        m.member.id = "236223047093321728";

        await ban.main(bot, m, args, prefix);

        expect(m.reply).toBeCalledWith(expect.stringMatching(/Are you a real villain\?|Have you ever caught a good guy\?\nLike a real super hero\?|Have you ever tried a disguise\?|What are you doing\?!\?!\?!|\*NO!\*, Don't touch that!|Fuck Off|Roses are red\nfuck me ;\)/), 5000);
        expect(m.deleteIn).toBeCalledWith(5000);
        expect(m.guild.banMember).not.toHaveBeenCalled();
        expect(m.guild.unbanMember).not.toHaveBeenCalled();
    });
});
