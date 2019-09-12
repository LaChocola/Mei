"use strict";

const utils = require("./utils");
const dbs = require("./dbs");

const lewdPool = require("./data/lewds.json");  // Relative to package root
const lewdTree = require("./data/lewdTree.json");  // Relative to package root
const lewdNames = require("./data/lewdNames.json");

function searchForSubtype(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    return Object.keys(lewdTree).find(function(subtype) {
        var relatedTerms = lewdTree[subtype];
        return relatedTerms.includes(searchTerm);
    });
}

function getLewdCounts(type) {
    var lewd = lewdPool[type];

    // Get counts for each subtype
    var counts = Object.keys(lewd).map(function(subtype) {
        return {
            subtype: subtype,
            count: lewd[subtype].length
        };
    });

    // Calculate total counts
    var total = counts.reduce((t, { count }) => t + count, 0);

    // Construct each line
    var lines = counts.map(function({ subtype, count }) {
        return `**${utils.capitalize(subtype)} ${utils.capitalize(type)} s:** ${count}`;
    });

    // Add the total string as the first line
    lines.shift("**Total " + utils.capitalize(type) + "s:** " + total);

    return lines.join("\n\n");
}

async function getCustomGtsNames(uid) {
    var userDb = await dbs.user.load();

    if (!(userDb.people[uid] && userDb.people[uid].names)) {
        return [];
    }

    var cnames = Object.keys(userDb.people[uid].names);
    return cnames;
}

function getDefaultGtsNames(guildId) {
    var customGuildIds = Object.keys(lewdNames);
    if (!customGuildIds.includes(guildId)) {
        guildId = "default";
    }
    var defaultNames = lewdNames[guildId];

    return {
        names: defaultNames,
        cleannames: utils.wrapJoin(defaultNames, ", ", 40),
        totalnames: defaultNames.length
    };
}

async function generateLewdMessage(smallid, big, guildid, maintype, subtype) {
    subtype = searchForSubtype(subtype);

    var userDb = await dbs.user.load();
    //=============get names==================
    var bigname = big;
    if (!big) {
        var cname = await getCustomGtsNames(smallid);
        var names;
        if (cname.length === 0) {
            names = getDefaultGtsNames(guildid).names;
        }
        else {
            names = cname;
        }
        bigname = utils.choose(names);
    }

    var female = true;
    var male = false;
    var futa = false;
    if (userDb.people[smallid]) {
        if (userDb.people[smallid].names) {
            if (userDb.people[smallid].names[bigname] === "male") {
                male = true;
                female = false;
            }
            if (userDb.people[smallid].names[bigname] === "futa") {
                futa = true;
                female = false;
            }
        }
    }

    var smallname = "<@" + smallid + ">, ";

    //=========panty info============

    var sides = ["front", "back"];
    var types1 = ["panties", "underwear", "thongs"];
    var types2 = ["panty", "thong", "underwear"];
    if (male) {
        types1 = ["underwear", "boxers", "briefs"];
        types2 = ["underwear", "underwear"];
    }
    if (futa) {
        types1 = types1.concat(["underwear", "boxers", "briefs"]);
        types2 = types2.concat(["underwear", "underwear"]);
    }

    var type1 = utils.choose(types1);
    var side = utils.choose(sides);
    var type2 = utils.choose(types2);

    //============feet info================
    var adjectivesFeet = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "powerful", "godly", "beautiful", "dirty", "filthy", "disgusting",
        "rancid", "giant", "massive", "moist", "sweat-soaked", "victim-covered", "soft", "lotion-scented"];

    var adjectivesFootwear = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "stinky, sweaty", "dirty", "filthy", "disgusting", "rancid", "giant", "massive", "moist",
        "sweat-soaked", "victim-covered", "old", "worn out", "grimy"];

    var adjectiveFeet = "";
    var adjectiveFootwear = "";

    var footRoll = Math.floor(Math.random() * 20) + 1; // roll from 1-20
    if (footRoll > 0 && footRoll < 16) { // If the roll is between 1-5
        adjectiveFeet = utils.choose(adjectivesFeet) + " ";
        adjectiveFootwear = utils.choose(adjectivesFootwear) + " ";
        if (footRoll > 0 && footRoll < 7) {
            var adjectiveFeet1 = utils.choose(adjectivesFeet);
            var adjectiveFeet2 = utils.choose(adjectivesFeet);
            if (adjectiveFeet1 === adjectiveFeet2) {
                adjectiveFeet2 = utils.choose(adjectivesFeet);
            }
            adjectiveFeet = adjectiveFeet1 + ", " + adjectiveFeet2 + " ";

            var adjectiveFootwear1 = utils.choose(adjectivesFootwear);
            var adjectiveFootwear2 = utils.choose(adjectivesFootwear);
            if (adjectiveFootwear1 === adjectiveFootwear2) {
                adjectiveFootwear2 = utils.choose(adjectivesFootwear);
            }
            adjectiveFootwear = adjectiveFootwear1 + ", " + adjectiveFootwear2 + " ";
        }
    }

    var nakedFeetPlurals = ["bare feet", "heels", "arches", "big toes", "toes", "soles"];
    var nakedFeetSingulars = ["bare foot", "heel", "arch", "big toe", "toe", "sole"];
    var footwearPlurals = ["shoes", "boots", "sandals", "flip flops", "sneakers", "pumps", "heels", "socks", "stockings", "nylons", "fishnets", "hose"];
    var footwearSingulars = ["shoe", "boot", "sandal", "flip flop", "sneaker", "pump", "heel", "sock", "stocking", "nylons", "fishnets", "hose"];
    var nakedFeetPlural = adjectiveFeet + utils.choose(nakedFeetPlurals);
    if (male) {
        footwearPlurals = Array.from(new Set([].concat(footwearPlurals, ["shoes", "boots", "sandals", "flip flops", "sneakers", "boots", "socks"])));
        footwearSingulars = Array.from(new Set([].concat(footwearSingulars, ["shoe", "boot", "sandal", "flip flop", "sneaker", "boot", "sock"])));
    }

    var nakedFeetSingular = adjectiveFeet + utils.choose(nakedFeetSingulars);
    var footwearPlural = adjectiveFootwear + utils.choose(footwearPlurals);
    var footwearSingular = adjectiveFootwear + utils.choose(footwearSingulars);

    var plurals = Array.from(new Set([].concat(nakedFeetPlural, footwearPlural)));
    var singulars = Array.from(new Set([].concat(nakedFeetSingular, footwearSingular)));
    var nakedFoots = Array.from(new Set([].concat(nakedFeetSingular, nakedFeetPlural)));
    var footwears = Array.from(new Set([].concat(footwearSingular, footwearPlural)));
    var feets = Array.from(new Set([].concat(nakedFeetPlural, nakedFeetSingular, footwearPlural, footwearSingular)));

    var plural = utils.choose(plurals);
    var singular = utils.choose(singulars);
    var nakedFoot = utils.choose(nakedFoots);
    var footwear = utils.choose(footwears);
    var feet = utils.choose(feets);

    //==========select from pool
    var candidates = [];
    for (const primarytypename in lewdPool) {
        if (lewdPool.hasOwnProperty(primarytypename)) {
            const primarytype = lewdPool[primarytypename];
            if (!maintype || primarytypename === maintype) {
                if (!primarytype[subtype]) {
                    subtype = null;
                }
                for (const secondarytypename in primarytype) {
                    if (primarytype.hasOwnProperty(secondarytypename)) {
                        const typepool = primarytype[secondarytypename];
                        if (!subtype || secondarytypename === subtype) {
                            for (var i = 0; i < typepool.length; i++) {
                                candidates.push(typepool[i]);
                            }
                        }
                    }
                }
            }
        }
    }
    var lewdmessage = utils.choose(candidates);

    //==================perform replacements==============

    lewdmessage = lewdmessage.replace(/\[name]/g, bigname).replace(/\[side]/g, side).replace(/\[type1]/g, type1).replace(/\[type2]/g, type2);
    lewdmessage = lewdmessage.replace(/\[feet]/g, feet).replace(/\[nakedfoot]/g, nakedFoot).replace(/\[nakedfeetplural]/g, nakedFeetPlural);
    lewdmessage = lewdmessage.replace(/\[nakedfeetsingular]/g, nakedFeetSingular).replace(/\[plural]/g, plural).replace(/\[footwearsingular]/g, footwearSingular);
    lewdmessage = lewdmessage.replace(/\[footwearplural]/g, footwearPlural).replace(/\[footwear]/g, footwear).replace(/\[singular]/g, singular);
    if (male) {
        lewdmessage = lewdmessage.replace(/\bher\b/ig, "his").replace(/\bshe\b/ig, "he").replace(/\bGTS\b/ig, "GT").replace(/\bbreasts\b/ig, "chest").replace(/\bpussy\b/ig, "dick").replace(/\bgirlfriend\b/ig, "boyfriend").replace(/\bvagina\b/ig, "dick").replace(/\bcunt\b/ig, "dick").replace(/\bclit\b/ig, "urethra").replace(/\bwomanhood\b/ig, "manhood").replace(/\blabia\b/ig, "foreskin");
    }
    if (female) {
        lewdmessage = lewdmessage.replace(/\bhis\b/ig, "her").replace(/\bhe\b/ig, "she").replace(/\bchest\b/ig, "breasts").replace(/\bdick\b/ig, "pussy").replace(/\bboyfriend\b/ig, "girlfriend").replace(/\bdick\b/ig, "pussy");
    }
    if (futa) {
        var futaRoll = Math.floor(Math.random() * 10) + 1;
        if (futaRoll !== 1) {
            lewdmessage = lewdmessage.replace(/\bpussy\b/ig, "dick").replace(/\bvagina\b/ig, "dick").replace(/\bcunt\b/ig, "dick").replace(/\bclit\b/ig, "urethra").replace(/\blabia\b/ig, "foreskin");
        }
    }
    lewdmessage = smallname + lewdmessage;

    //====================return message=============

    if (!subtype) {
        subtype = "Random";
    }
    var emojis = {
        "boob": ":melon:",
        "butt": ":peach:",
        "vagina": ":sweat_drops:",
        "foot": ":footprints:",
        "panty": ":bikini:",
        "vore": ":lips:",
        "hand": ":raised_back_of_hand:",
        "leg": ":dancer:",
        "proposal": ":ring:",
        "cloth": ":shirt:",
        "toy": ":battery:",
        "misc": ":question:",
        "Random": ":question:"
    };
    var emoji = emojis[subtype];
    lewdmessage = [lewdmessage, emoji, subtype];
    return lewdmessage;
}

module.exports = {
    getLewdCounts,
    getCustomGtsNames,
    getDefaultGtsNames,
    generateLewdMessage
};
