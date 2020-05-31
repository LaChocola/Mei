"use strict";

const tcg = require("./tcg");

jest.mock("../misc");

// Stub test to be expanded on later
test("!tcg", async function() {
    var { bot, m, args, prefix } = setupCmd("tcg");

    await tcg.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith({
        embed: {
            color: 10641654,
            fields: [
                { inline: true, name: "Attacks", value: "Windmill: Switch this Pokémon with 1 of your Benched Pokémon."},
                { inline: true, name: "HP", value: "120" },
                { inline: true, name: "​", value: "​"},
                { inline: true, name: "Weaknesses", value: "Fire: ×2" },
                { inline: true, name: "Resistances", value: "None"},
                { inline: true, name: "​", value: "​"}
            ],
            image: {
                url: "https://images.pokemontcg.io/xy7/4.png"
            },
            title: "Bellossom"
        }
    });
});
