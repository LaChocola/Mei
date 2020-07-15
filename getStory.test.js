"use strict";

const getStory = require("./getStory");

function getm(options) {
    if (!options) {
        options = {};
    }
    var m = {
        author: {
            avatarURL: "https://cdn.discordapp.com/avatars/161027274764713984/bba5f97db9591ea042825fa7b332dab4.png?size=1024",
            id: "161027274764713984",
            username: "author_username"
        },
        guild: {
            id: "658890180958093312",
            members: [{
                username: "victim"
            }]
        },
        member: {
            nick: "author_nickname"
        },
        mentions: [
        ]
    };

    return m;
}

jest.mock("./data");
jest.mock("./people");
jest.mock("./servers");

describe("Gentle Responses", function() {
    test("!g", async function() {
        var m = getm();
        var args = "";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xFF00DC);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!g [subtype]", async function() {
        var m = getm();
        var args = "butt";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xFF00DC);
        expect(story.embed.title).toBe(":peach: butt");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!g length", async function() {
        var m = getm();
        var args = "length";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.description).toMatch(/\*\*Names available: \*\*\d+.*/);
    });

    test("!g someone", async function() {
        var m = getm();
        var args = "someone";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xFF00DC);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!g [user]", async function() {
        var m = getm();
        var args = "victim";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xFF00DC);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!g [giantess]", async function() {
        var m = getm();
        var args = "Samus";
        var command = "g";
        var type = "gentle";
        var responseColor = 0xFF00DC;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xFF00DC);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });
});

describe("Violent Responses", function() {
    test("!v", async function() {
        var m = getm();
        var args = "";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!v [subtype]", async function() {
        var m = getm();
        var args = "butt";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.title).toBe(":peach: butt");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!v length", async function() {
        var m = getm();
        var args = "length";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.description).toMatch(/\*\*Names available: \*\*\d+.*/);
    });

    test("!v someone", async function() {
        var m = getm();
        var args = "someone";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!v [user]", async function() {
        var m = getm();
        var args = "victim";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!v [giantess]", async function() {
        var m = getm();
        var args = "Samus";
        var command = "v";
        var type = "violent";
        var responseColor = 0xA260F6;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });
});

describe("TF Responses", function() {
    test("!tf", async function() {
        var m = getm();
        var args = "";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0x00FF8F);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!tf [subtype]", async function() {
        var m = getm();
        var args = "butt";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0x00FF8F);
        expect(story.embed.title).toBe(":peach: butt");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!tf length", async function() {
        var m = getm();
        var args = "length";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0xA260F6);
        expect(story.embed.description).toMatch(/\*\*Names available: \*\*\d+.*/);
    });

    test("!tf someone", async function() {
        var m = getm();
        var args = "someone";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0x00FF8F);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!tf [user]", async function() {
        var m = getm();
        var args = "victim";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0x00FF8F);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });

    test("!tf [giantess]", async function() {
        var m = getm();
        var args = "Samus";
        var command = "tf";
        var type = "tf";
        var responseColor = 0x00FF8F;

        var story = await getStory(m, args, command, type, responseColor);
        expect(story.embed.color).toBe(0x00FF8F);
        expect(story.embed.title).toBe(":question: Random");
        expect(story.embed.description).toMatch(/<@161027274764713984>, .*/);
        expect(story.embed.footer.text).toBe("100th response");
    });
});
