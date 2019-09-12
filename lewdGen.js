"use strict";

const _ = require("lodash");
const escapeStringRegexp = require("escape-string-regexp");

const utils = require("./utils");
const dbs = require("./dbs");

// Relative to package root
const lewdPool = require("./data/lewds.json");
const lewdTree = require("./data/lewdTree.json");
const lewdNames = require("./data/lewdNames.json");
const lewdChoices = require("./data/lewdChoices.json");

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

function applyReplacements(s, replacements) {
    replacements.forEach(function({ oldVal, newVal }) {
        var regex;
        if (oldVal.startsWith("[") && oldVal.endsWith("]")) {
            regex = new RegExp(escapeStringRegexp(oldVal), "g");
        }
        else {
            regex = new RegExp(`\b${escapeStringRegexp(oldVal)}\b`, "ig");
        }

        s = s.replace(regex, newVal);
    });
    return s;
}

async function generateLewdMessage(userId, bigName, guildId, maintype, subtype) {
    subtype = searchForSubtype(subtype);

    var userDb = await dbs.user.load();
    //=============get names==================
    if (!bigName) {
        var names = await getCustomGtsNames(userId);
        if (names.length === 0) {
            names = getDefaultGtsNames(guildId).names;
        }
        bigName = utils.choose(names);
    }

    var gender = userDb.people[userId] && userDb.people[userId].names && userDb.people[userId].names[bigName];
    // Default to "female" gender, if none is loaded
    if (!["female", "male", "futa"].includes(gender)) {
        gender = "female";
    }

    //========= panty info ============

    // TODO: Make fute underwear choices a automatic combination of male + female values
    var side = utils.choose(lewdChoices.sides);
    var underwearPlural = utils.choose(lewdChoices.genders[gender].underwearPlural);
    var underwearSingular = utils.choose(lewdChoices.genders[gender].underwearSingular);

    //============ feet info ================
    var adjectiveFeet = "";
    var adjectiveFootwear = "";

    var footRoll = _.random(1, 20); // roll from 1-20
    if (footRoll <= 6) { // 30% of the time, choose 2 adjectives
        var [adjectiveFeet1, adjectiveFeet2] = utils.chooseMany(lewdChoices.adjectivesFeet, 2);
        adjectiveFeet = `${adjectiveFeet1}, ${adjectiveFeet2} `;
        var [adjectiveFootwear1, adjectiveFootwear2] = utils.chooseMany(lewdChoices.adjectivesFootwear, 2);
        adjectiveFootwear = `${adjectiveFootwear1}, ${adjectiveFootwear2} `;
    }
    else if (footRoll > 6 && footRoll <= 15) { // 45% of the time, choose 1 adjective
        adjectiveFeet = utils.choose(lewdChoices.adjectivesFeet) + " ";
        adjectiveFootwear = utils.choose(lewdChoices.adjectivesFootwear) + " ";
    }
    // 25% of the time, choose no adjective

    var nakedFeetPlural = adjectiveFeet + utils.choose(lewdChoices.nakedFeetPlurals);
    var nakedFeetSingular = adjectiveFeet + utils.choose(lewdChoices.nakedFeetSingulars);
    var footwearPlural = adjectiveFootwear + utils.choose(lewdChoices.footwearPlurals);
    var footwearSingular = adjectiveFootwear + utils.choose(lewdChoices.footwearSingulars);

    var footPlurals = Array.from(new Set([].concat(nakedFeetPlural, footwearPlural)));
    var footSingulars = Array.from(new Set([].concat(nakedFeetSingular, footwearSingular)));
    var nakedFoots = Array.from(new Set([].concat(nakedFeetSingular, nakedFeetPlural)));
    var footwears = Array.from(new Set([].concat(footwearSingular, footwearPlural)));
    var feets = Array.from(new Set([].concat(nakedFeetPlural, nakedFeetSingular, footwearPlural, footwearSingular)));

    var footPlural = utils.choose(footPlurals);
    var footSingular = utils.choose(footSingulars);
    var nakedFoot = utils.choose(nakedFoots);
    var footwear = utils.choose(footwears);
    var feet = utils.choose(feets);

    //========== select from pool

    // This way of writing it is cleaner, but it doesn't lead to a equal chance for each story
    /*
    // Select the chosen main pool, or pick one at random
    var mainPool = lewdPool[maintype];
    if (!mainPool) {
        mainPool = utils.choose(lewdPool);
    }

    // Select the chosen sub pool from the main pool, or pick on at random
    var subPool = mainPool[subtype];
    if (!subPool) {
        subPool = utils.choose(Object.values(mainPool));
    }

    // Select a random story from the sub pool
    var lewdmessage = utils.choose(subPool);
    */

    var mainPools = [lewdPool[maintype]] || Object.values(lewdPool);
    var candidates = _.flatten(mainPools.map(function(mainPool) {   // Get the candidates for each mainPool, and flatten them into a single array
        var mainPoolCandidates = mainPool[subtype]; // Get an array of candidates for the provided subtype
        if (!mainPoolCandidates) {
            mainPoolCandidates = _.flatten(Object.values(mainPool));    // If no candidates were found, get the candidates for each subPool, and flatten them into a single array
        }
        return mainPoolCandidates;
    }));

    var lewdMessage = utils.choose(candidates);

    //==================perform replacements==============

    var replacements = [
        { oldVal: "[name]", newVal: bigName },
        { oldVal: "[side]", newVal: side },
        { oldVal: "[type1]", newVal: underwearPlural },
        { oldVal: "[type2]", newVal: underwearSingular },
        { oldVal: "[feet]", newVal: feet },
        { oldVal: "[nakedfoot]", newVal: nakedFoot },
        { oldVal: "[nakedfeetplural]", newVal: nakedFeetPlural },
        { oldVal: "[nakedfeetsingular]", newVal: nakedFeetSingular },
        { oldVal: "[plural]", newVal: footPlural },
        { oldVal: "[footwearsingular]", newVal: footwearSingular },
        { oldVal: "[footwearplural]", newVal: footwearPlural },
        { oldVal: "[footwear]", newVal: footwear },
        { oldVal: "[singular]", newVal: footSingular }
    ];

    lewdMessage = applyReplacements(lewdMessage, replacements);

    // TODO: Make futa replacements only apply on a 1/10 chance
    var genderReplacements = lewdChoices.genders[gender].replacements;
    if (genderReplacements) {
        lewdMessage = applyReplacements(lewdMessage, genderReplacements);
    }

    lewdMessage = `<@${userId}>, ${lewdMessage}`;

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
    var lewdMessageArray = [lewdMessage, emoji, subtype];
    return lewdMessageArray;
}

module.exports = {
    getLewdCounts,
    getCustomGtsNames,
    getDefaultGtsNames,
    generateLewdMessage
};
