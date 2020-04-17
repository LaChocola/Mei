"use strict";

const pokemon = require("pokemontcgsdk");

const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var cards = await pokemon.card.where({ supertype: "pokemon" });
        var chosen = misc.choose(cards);

        var attack = chosen.attacks && chosen.attacks[0];
        var weakness = chosen.weaknesses && chosen.weaknesses[0];
        var resistance = chosen.resistances && chosen.resistances[0];

        var attacks = attack && (attack.name + (attack.text ? ": " + attack.text : "")) || "None";
        var weaknesses = weakness && (weakness.type + ": " + weakness.value) || "None";
        var resistances = resistance && (resistance.type + ": " + resistance.value) || "None";

        bot.createMessage(m.channel.id, {
            embed: {
                title: chosen.name,
                color: 0xA260F6,
                fields: [
                    {
                        name: "Attacks",
                        value: attacks,
                        inline: true
                    },
                    {
                        name: "HP",
                        value: chosen.hp,
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: true
                    },
                    {
                        name: "Weaknesses",
                        value: weaknesses,
                        inline: true
                    },
                    {
                        name: "Resistances",
                        value: resistances,
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: true
                    }
                ],
                image: {
                    url: chosen.imageUrl
                }
            }
        });
    },
    help: "TCG Cards"
};
