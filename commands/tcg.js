"use strict";

const pokemon = require("pokemontcgsdk");

module.exports = {
    main: function(Bot, m, args, prefix) {
        pokemon.card.where({
            supertype: "pokemon"
        })
            .then(cards => {
                var chosen = cards[Math.floor(Math.random() * cards.length)];
                var weaknesses = "None";
                var resistances = "None";
                var attacks;
                if (chosen.attacks[0]) {
                    if (chosen.attacks[0].text) {
                        attacks = chosen.attacks[0].name + ": " + chosen.attacks[0].text;
                    }
                    else {
                        attacks = chosen.attacks[0].name;
                    }
                }
                if (chosen.weaknesses[0]) {
                    weaknesses = chosen.weaknesses[0].type + ": " + chosen.weaknesses[0].value;
                }
                if (chosen.resistances) {
                    resistances = chosen.resistances[0].type + ": " + chosen.resistances[0].value;
                }
                const msgEmbed = {
                    "embed": {
                        "title": chosen.name,
                        "color": 0xA260F6,
                        "fields": [{
                            "name": "Attacks",
                            "value": attacks,
                            "inline": true
                        },
                        {
                            "name": "HP",
                            "value": chosen.hp,
                            "inline": true
                        },
                        {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        },
                        {
                            "name": "Weaknesses",
                            "value": weaknesses,
                            "inline": true
                        },
                        {
                            "name": "Resistances",
                            "value": resistances,
                            "inline": true
                        },
                        {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        }
                        ],
                        "image": {
                            "url": chosen.imageUrl
                        }
                    }
                };
                Bot.createMessage(m.channel.id, msgEmbed);
            });
    },
    help: "TCG Cards"
};
