"use strict";

const fs = require("fs").promises;

const Perf = require("pixl-perf");
const ordinal = require("ordinal");

const { choose, capitalize, chunkArray, chooseMember, getMentionedId } = require("./misc");
const datadb = require("./data");
const peopledb = require("./people");
const ids = require("./ids");

var perf = new Perf();

// Subtype Aliases
function getSubtypeAliasMap() {
    // TODO: convert this to json when have time
    var subtypeAliasTree = {
        "boob": ["boob", "boobs", "tit", "tits", "breast", "breasts"],
        "butt": ["butt", "bum", "bums", "butts", "ass"],
        "vagina": ["vagina", "pussy", "insertion", "cunt", "cunny"],
        "foot": ["foot", "foote", "feet"],
        "panty": ["panty", "panties", "pantie", "underwear", "thong", "thongs"],
        "vore": ["vore", "mouth"],
        "hand": ["hand", "hands"],
        "leg": ["leg", "legs", "thighs", "thigh"],
        "proposal": ["proposal", "mary", "wed", "marriage"],
        "cloth": ["cloth", "panties", "panty", "clothes", "clothing", "bra", "pants", "panty", "panties", "pantie", "underwear", "thong", "thongs"],
        "toy": ["toy", "dildo", "beads", "object", "plug"],
        "misc": ["misc", "alt", "other"]
    };

    var subtypeAliasMap = {};
    Object.keys(subtypeAliasTree).forEach(function(subtype) {
        subtypeAliasMap[subtype] = subtype;
        subtypeAliasTree[subtype].forEach(function(alias) {
            subtypeAliasMap[alias] = subtype;
        });
    });

    return subtypeAliasMap;
}

function getSubtype(s) {
    var tracker_getSubtypeAliasMap = perf.begin("getSubtypeAliasMap");
    perf.count("getSubtypeAliasMap");
    var subtypeAliasMap = getSubtypeAliasMap();
    tracker_getSubtypeAliasMap.end();
    var subtypeEmojis = {
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

    var foundAlias = Object.keys(subtypeAliasMap).find(function(alias) {
        return s.match(new RegExp("\\b" + alias + "\\b", "i"));
    });

    var subtype = subtypeAliasMap[foundAlias] || "Random";
    var emoji = subtypeEmojis[subtype];

    return { subtype, emoji };
}

// Giantess names
async function getAllGTSNames(uid, guildid) {
    var tracker_getCustomGTSNames = perf.begin("getCustomGTSNames");
    perf.count("getCustomGTSNames");
    var customNames = await getCustomGTSNames(uid);
    tracker_getCustomGTSNames.end();

    var tracker_getDefaultGTSNames = perf.begin("getDefaultGTSNames");
    perf.count("getDefaultGTSNames");
    var defaultNames = getDefaultGTSNames(guildid);
    tracker_getDefaultGTSNames.end();

    var allNames = customNames.concat(defaultNames);
    return allNames;
}

async function getGTSNames(uid, guildid) {
    var tracker_getCustomGTSNames = perf.begin("getCustomGTSNames");
    perf.count("getCustomGTSNames");
    var names = await getCustomGTSNames(uid);
    tracker_getCustomGTSNames.end();

    if (names.length === 0) {
        var tracker_getDefaultGTSNames = perf.begin("getDefaultGTSNames");
        perf.count("getDefaultGTSNames");
        names = getDefaultGTSNames(guildid);
        tracker_getDefaultGTSNames.end();
    }

    return names;
}

function getDefaultGTSNames(guildid) {
    var defaultNames = ["Mei", "Sucy", "2B", "Mt. Lady", "Vena", "Miku", "Lexi", "Baiken", "Ryuko", "Sombra", "Wolfer", "Gwen", "Mercy", "Gwynevere", "Tracer", "Aqua", "Megumin", "Cortana", "Yuna", "Lulu", "Rikku", "Rosalina", "Samus", "Princess Peach", "Palutena", "Shin", "Kimmy", "Zoey", "Camilla", "Lillian", "Narumi", "D.va"];
    var guildNames = {
        // Krumbly's ant farm only
        [ids.guilds.krumblysantfarm]: ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Lucy", "Ryuko", "Krumbly"],
        // r/Macrophilia Only
        [ids.guilds.r_macrophilia]: ["Miau"],
        // Giantess Archive
        [ids.guilds.giantessarchive]: ["Brittany", "Bethany", "Alicia", "Katie", "Cali", "Asuna", "Cat", "Brianna", "Emily", "Alice", "Yuri", "Monica", "Brie", "Sierra"],
        // The Big House Only
        [ids.guilds.bighouse]: defaultNames.concat(["Zem", "Ardy", "Vas"]),
        // Small World Only
        [ids.guilds.smallworld]: defaultNames.concat(["Docop", "Mikki", "Spellgirl"]),
        // The Giantess Club Only
        [ids.guilds.giantessclub]: ["Yami", "Mikan", "Momo", "Nana", "Yui", "May", "Dawn", "Hilda", "Rosa", "Serena", "Palutena", "Wii Fit Trainer", "Lucina", "Robin", "Corrin", "Bayonetta", "Zelda", "Sheik", "Tifa", "Chun-li", "R. Mika", "Daisy", "Misty", "Gardevoir", "Lyn", "Cammy", "Angewomon", "Liara", "Samara", "Tali", "Miranda", "Cus", "Marcarita", "Vados", "Wendy", "Sabrina", "Cana", "Erza", "Levy", "Lucy", "Wendy Marvell"]
    };

    var names = guildNames[guildid] || defaultNames;

    return names;
}

async function getCustomGTSNames(uid) {
    var data = await peopledb.load();
    // TODO: This doesn't load data? It won't actually have updated user data.
    return data.people[uid]
        && data.people[uid].names
        && Object.keys(data.people[uid].names) || [];
}

async function getNamesSummary(uid, guildid, perLine) {
    var tracker_getGTSNames = perf.begin("getGTSNames");
    perf.count("getGTSNames");
    var names = await getGTSNames(uid, guildid);
    tracker_getGTSNames.end();

    if (perLine === undefined) {
        perLine = 4;
    }

    // Group names in groups of [perLine] per line
    var namesString = chunkArray(names, perLine).map(function(chunk) {
        return chunk.join(", ");
    }).join(", \n");

    return "**Names available: **" + names.length + "\n " + namesString;
}

// Lewd Summary
async function getLewdCountsSummary(type) {
    var friendlyTypes = {
        "violent": "Smushes",
        "tf": "TF's",
        "gentle": "Gentles"
    };
    var friendlyType = friendlyTypes[type];

    var tracker_loadLewdPool = perf.begin("loadLewdPool");
    perf.count("loadLewdPool");
    var pool = await loadLewdPool();
    tracker_loadLewdPool.end();

    var total = 0;
    var lines = [];
    var typepool = pool[type];
    Object.keys(typepool).forEach(function(subtype) {
        var subtypepool = typepool[subtype];
        var count = subtypepool.length;
        total += count;
        lines.push("**" + capitalize(subtype) + " " + friendlyType + ":** " + count);
    });
    lines.unshift("**Total " + friendlyType + ":** " + total);

    var output = lines.join("\n\n");
    return output;
}

async function getLewdSummary(uid, guildid, type) {
    var tracker_getNamesSummary = perf.begin("getNamesSummary");
    perf.count("getNamesSummary");
    var namesSummary = await getNamesSummary(uid, guildid);
    tracker_getNamesSummary.end();

    var tracker_getLewdCountsSummary = perf.begin("getLewdCountsSummary");
    perf.count("getLewdCountsSummary");
    var lewdCountsSummary = await getLewdCountsSummary(type);
    tracker_getLewdCountsSummary.end();

    var summaryString = namesSummary + "\n \n" + lewdCountsSummary;
    return summaryString;
}

// Generate Lewd Story
async function loadLewdPool() {
    var pool = JSON.parse(await fs.readFile("./db/lewds.json"));
    return pool;
}

async function generateLewdMessage(smallid, bigname, guildid, type, subtype) {
    var data = await peopledb.load();

    //=============get names==================
    if (!bigname) {
        var tracker_getGTSNames = perf.begin("getGTSNames");
        perf.count("getGTSNames");
        bigname = choose(await getGTSNames(smallid, guildid));
        tracker_getGTSNames.end();
    }

    var gender = data.people[smallid] && data.people[smallid].names && data.people[smallid].names[bigname] || "female";

    var smallname = `<@${smallid}>, `;

    //=========panty info============

    var sides = ["front", "back"];
    var types1 = {
        "female": ["panties", "underwear", "thongs"],
        "male": ["underwear", "boxers", "briefs"],
        "futa": ["panties", "underwear", "thongs", "boxers", "briefs"]
    };

    var types2 = {
        "female": ["panty", "thong", "underwear"],
        "male": ["underwear"],
        "futa": ["panty", "thong", "underwear"]
    };

    var side = choose(sides);
    var type1 = choose(types1[gender]);
    var type2 = choose(types2[gender]);

    //============feet info================
    var adjectivesFeet = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "powerful", "godly", "beautiful", "dirty", "filthy", "disgusting", "rancid", "giant", "massive", "moist", "sweat-soaked", "victim-covered", "soft", "lotion-scented"];
    var adjectivesFootwear = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "stinky, sweaty", "dirty", "filthy", "disgusting", "rancid", "giant", "massive", "moist", "sweat-soaked", "victim-covered", "old", "worn out", "grimy"];

    var adjectiveFeet = "";
    var adjectiveFootwear = "";

    var roll = Math.floor(Math.random() * 20) + 1; // roll from 1-20
    if (roll > 0 && roll < 16) { // If the roll is between 1-5
        adjectiveFeet = choose(adjectivesFeet) + " ";
        adjectiveFootwear = choose(adjectivesFootwear) + " ";
        if (roll > 0 && roll < 7) {
            var adjectiveFeet1 = choose(adjectivesFeet);
            var adjectiveFeet2 = choose(adjectivesFeet);
            if (adjectiveFeet1 === adjectiveFeet2) {
                adjectiveFeet2 = choose(adjectivesFeet);
            }
            adjectiveFeet = adjectiveFeet1 + ", " + adjectiveFeet2 + " ";

            var adjectiveFootwear1 = choose(adjectivesFootwear);
            var adjectiveFootwear2 = choose(adjectivesFootwear);
            if (adjectiveFootwear1 === adjectiveFootwear2) {
                adjectiveFootwear2 = choose(adjectivesFootwear);
            }
            adjectiveFootwear = adjectiveFootwear1 + ", " + adjectiveFootwear2 + " ";
        }
    }

    var nakedFeetPlurals = ["bare feet", "heels", "arches", "big toes", "toes", "soles"];
    var nakedFeetSingulars = ["bare foot", "heel", "arch", "big toe", "toe", "sole"];
    var footwearPlurals = ["shoes", "boots", "sandals", "flip flops", "sneakers", "pumps", "heels", "socks", "stockings", "nylons", "fishnets", "hose"];
    var footwearSingulars = ["shoe", "boot", "sandal", "flip flop", "sneaker", "pump", "heel", "sock", "stocking", "nylons", "fishnets", "hose"];
    var nakedFeetPlural = adjectiveFeet + choose(nakedFeetPlurals);
    if (gender === "male") {
        footwearPlurals = Array.from(new Set([].concat(footwearPlurals, ["shoes", "boots", "sandals", "flip flops", "sneakers", "boots", "socks"])));
        footwearSingulars = Array.from(new Set([].concat(footwearSingulars, ["shoe", "boot", "sandal", "flip flop", "sneaker", "boot", "sock"])));
    }

    var nakedFeetSingular = adjectiveFeet + choose(nakedFeetSingulars);
    var footwearPlural = adjectiveFootwear + choose(footwearPlurals);
    var footwearSingular = adjectiveFootwear + choose(footwearSingulars);

    var plurals = Array.from(new Set([].concat(nakedFeetPlural, footwearPlural)));
    var singulars = Array.from(new Set([].concat(nakedFeetSingular, footwearSingular)));
    var nakedFoots = Array.from(new Set([].concat(nakedFeetSingular, nakedFeetPlural)));
    var footwears = Array.from(new Set([].concat(footwearSingular, footwearPlural)));
    var feets = Array.from(new Set([].concat(nakedFeetPlural, nakedFeetSingular, footwearPlural, footwearSingular)));

    var plural = choose(plurals);
    var singular = choose(singulars);
    var nakedFoot = choose(nakedFoots);
    var footwear = choose(footwears);
    var feet = choose(feets);

    //==========select from pool
    var tracker_loadLewdPool = perf.begin("loadLewdPool");
    perf.count("loadLewdPool");
    var pool = await loadLewdPool();
    tracker_loadLewdPool.end();

    var candidates = pool[type][subtype] || [];
    if (candidates.length === 0) {
        Object.values(pool[type]).forEach(function(subpool) {
            candidates = candidates.concat(subpool);
        });
    }

    var lewdmessage = choose(candidates);

    //==================perform replacements==============

    var replacements = {
        "name": bigname,
        "side": side,
        "type1": type1,
        "type2": type2,
        "feet": feet,
        "nakedfoot": nakedFoot,
        "nakedfeetplural": nakedFeetPlural,
        "nakedfeetsingular": nakedFeetSingular,
        "plural": plural,
        "footwearsingular": footwearSingular,
        "footwearplural": footwearPlural,
        "footwear": footwear,
        "singular": singular
    };

    Object.entries(replacements).forEach(function([oldVal, newVal]) {
        // Regex to allow global replacement
        var re = RegExp(`\\[${oldVal}\\]`, "g");
        lewdmessage = lewdmessage.replace(re, newVal);
    });

    var genderReplacements = {
        "male": {
            "her": "his",
            "she": "he",
            "GTS": "GT",
            "breasts": "chest",
            "pussy": "dick",
            "girlfriend": "boyfriend",
            "vagina": "dick",
            "cunt": "dick",
            "clit": "urethra",
            "womanhood": "manhood",
            "labia": "foreskin"
        },
        "female": {
            "his": "her",
            "he": "she",
            "chest": "breasts",
            "dick": "pussy",
            "boyfriend": "girlfriend"
        },
        "futa": {
            "pussy": "dick",
            "vagina": "dick",
            "cunt": "dick",
            "clit": "urethra",
            "labia": "foreskin"
        }
    };

    var toReplace = genderReplacements[gender];
    if (gender === "futa" && (Math.floor(Math.random() * 10) !== 0)) {
        toReplace = {};
    }

    Object.entries(toReplace).forEach(function([oldVal, newVal]) {
        var re = new RegExp(`\\b${oldVal}\\b`, "ig");
        lewdmessage = lewdmessage.replace(re, newVal);
    });

    return smallname + lewdmessage;
}

async function getStory(m, args, command, type, isNSFW, responseColor) {
    perf.begin();
    perf.count("getStory");
    var guildid = m.guild.id;
    var guildMembers = m.guild.members;
    var author = m.author;
    var authorNick = m.member && m.member.nick || m.author.username;

    if (isNSFW && !m.channel.nsfw) {
        return "This command can only be used in NSFW channels";
    }

    args = args.toLowerCase();
    var argLength = args.includes("length");
    var argSomeone = args.includes("someone");
    var argInvert = args.includes("invert") || args.includes("inverse");

    var smallid;
    if (argSomeone) {
        smallid = chooseMember(guildMembers);
    }
    else {
        smallid = getMentionedId(m, args) || author.id;
    }

    if (!smallid) {
        smallid = author.id;
    }

    // Lewd Summary
    if (argLength) {
        var tracker_getLewdSummary = perf.begin("getLewdSummary");
        perf.count("getLewdSummary");
        var lewdSummary = getLewdSummary(smallid, guildid, type);
        tracker_getLewdSummary.end();
        return {
            embed: {
                "color": 0xA260F6,
                "description": lewdSummary
            }
        };
    }

    var bigNick;
    if (argInvert) {
        bigNick = authorNick;
    }
    else {
        var tracker_getAllGTSNames = perf.begin("getAllGTSNames");
        perf.count("getAllGTSNames");
        var names = await getAllGTSNames(smallid, guildid);
        tracker_getAllGTSNames.end();
        bigNick = names.find(n => args.includes(n.toLowerCase()));
    }

    var tracker_getSubtype = perf.begin("getSubtype");
    perf.count("getSubtype");
    var { subtype, emoji } = getSubtype(args);
    tracker_getSubtype.end();

    var tracker_generateLewdMessage = perf.begin("generateLewdMessage");
    perf.count("generateLewdMessage");
    var lewdmessage = await generateLewdMessage(smallid, bigNick, guildid, type, subtype);
    tracker_generateLewdMessage.end();

    var data = await datadb.load();
    var usageCount = data.commands[command].users[author.id];
    var usageStr = ordinal(+usageCount);

    perf.end();
    printMetrics();
    return {
        embed: {
            color: responseColor,
            title: `${emoji} ${subtype}`,
            description: lewdmessage,
            timestamp: new Date().toISOString(),
            footer: {
                text: `${usageStr} response`,
                icon_url: author.avatarURL
            }
        }
    };
}

function printMetrics() {
    var metrics = perf.metrics();
    var avgmetrics = {};
    for (var m in metrics.perf) {
        avgmetrics[m] = metrics.perf[m] / (metrics.counters[m] || 1);
    }
    var metricsOutput = Object.entries(avgmetrics)
        .map(([name, value]) => name + ": " + value + "ms")
        .join("\n");
    console.debug(metricsOutput);
}

module.exports = getStory;
