"use strict";

const pokemon = jest.genMockFromModule("pokemontcgsdk");

pokemon.card.where.mockResolvedValue([{
    "id": "xy7-4",
    "name": "Bellossom",
    "nationalPokedexNumber": 182,
    "imageUrl": "https://images.pokemontcg.io/xy7/4.png",
    "imageUrlHiRes": "https://images.pokemontcg.io/xy7/4_hires.png",
    "types": [
        "Grass"
    ],
    "supertype": "Pokémon",
    "subtype": "Stage 2",
    "evolvesFrom": "Gloom",
    "hp": "120",
    "retreatCost": [
        "Colorless"
    ],
    "convertedRetreatCost": 1,
    "number": "4",
    "artist": "Mizue",
    "rarity": "Uncommon",
    "series": "XY",
    "set": "Ancient Origins",
    "setCode": "xy7",
    "attacks": [
        {
            "cost": [
                "Grass"
            ],
            "name": "Windmill",
            "text": "Switch this Pokémon with 1 of your Benched Pokémon.",
            "damage": "20",
            "convertedEnergyCost": 1
        },
        {
            "cost": [
                "Grass",
                "Colorless"
            ],
            "name": "Flower Tornado",
            "text": "Move as many Grass Energy attached to your Pokémon to your other Pokémon in any way you like.",
            "damage": "60",
            "convertedEnergyCost": 2
        }
    ],
    "weaknesses": [
        {
            "type": "Fire",
            "value": "×2"
        }
    ]
}]);

module.exports = pokemon;
