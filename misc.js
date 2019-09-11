"use strict";

const fs = require("fs");

const conf = require("./conf");
const dbs = require("./dbs");

class Misc { // Declaring export as a class because cbf to make other way work properly. Should probably do other way for consistancy though
    static getTrueName(id, m) {
        var name = m.channel.guild.members.get(id).nick || m.channel.guild.members.get(id).username;
        return name;
    }

    static getSomeone(m) {
        var members = m.channel.guild.members.filter(m => !m.bot);
        var people = [];
        members.forEach(function(member) {
            if ((member.status != "offline") && (member.user.id != m.bot.user.id)) {
                people.push(member.id);
            }
        });
        var person = people[Math.floor(Math.random() * people.length)];
        return person;
    }

    static lewdAliasTree() {
        var obj = {//TODO: convert this to json when have time
            "boob": ["boob", "boobs", "tit", "tits", "breast", "breasts"],
            "butt": ["bum", "bums", "butt", "butts", "ass"],
            "vagina": ["vagina", "pussy", "insertion", "cunt", "cunny"],
            "foot": ["foot", "foote", "feet"],
            "panty": ["panty", "panties", "pantie", "underwear", "thong", "thongs"],
            "vore": ["vore", "mouth"],
            "hand": ["hand", "hands"],
            "leg": ["leg", "legs", "thighs", "thigh"],
            "proposal": ["proposal", "mary", "wed", "marriage"],
            "cloth": ["panties", "panty", "cloth", "clothes", "clothing", "bra", "pants", "panty", "panties", "pantie", "underwear", "thong", "thongs"],
            "toy": ["dildo", "beads", "toy", "object", "plug"],
            "misc": ["misc", "alt", "other"]
        };
        return obj;
    }

    static resolveLewdAlias(name) {
        var lewdtree = Misc.lewdAliasTree();
        for (const key in lewdtree) {
            if (lewdtree.hasOwnProperty(key)) {
                const element = lewdtree[key];
                for (var i = 0; i < element.length; i++) {
                    if (name == lewdtree[key][i]) {
                        return key;
                    }
                }
            }
        }
        return false;
    }

    static searchForLewd(string) {
        var lewdtree = Misc.lewdAliasTree();
        for (const key in lewdtree) {
            if (lewdtree.hasOwnProperty(key)) {
                const element = lewdtree[key];
                for (var i = 0; i < element.length; i++) {
                    if (string.indexOf(lewdtree[key][i]) != -1) {
                        var reg = new RegExp("\\b" + lewdtree[key][i] + "\\b");
                        var match = reg.exec(string);
                        if (match != null && match[0]) {
                            return key;
                        }
                    }
                }
            }
        }
        return false;
    }

    static randomelement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static async generateLewdMessage(smallid, big, guildid, maintype, subtype) {
        var userDb = await dbs.user.load();
        //=============get names==================
        var bigname = big;
        if (big == false) {
            var cname = Misc.getcustomGTSNames(smallid);
            var names;
            if (cname.length == 0) {
                names = Misc.getDefaultGTSNames(guildid).names;
            }
            else {
                names = cname;
            }
            bigname = Misc.randomelement(names);
        }

        var female = true;
        var male = false;
        var futa = false;
        if (userDb.people[smallid]) {
            if (userDb.people[smallid].names) {
                if (userDb.people[smallid].names[bigname] == "male") {
                    male = true;
                    female = false;
                }
                if (userDb.people[smallid].names[bigname] == "futa") {
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

        var type1 = Misc.randomelement(types1);
        var side = Misc.randomelement(sides);
        var type2 = Misc.randomelement(types2);

        //============feet info================
        var adjectivesFeet = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "powerful", "godly", "beautiful", "dirty", "filthy", "disgusting",
            "rancid", "giant", "massive", "moist", "sweat-soaked", "victim-covered", "soft", "lotion-scented"];

        var adjectivesFootwear = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "stinky, sweaty", "dirty", "filthy", "disgusting", "rancid", "giant", "massive", "moist",
            "sweat-soaked", "victim-covered", "old", "worn out", "grimy"];

        var adjectiveFeet = "";
        var adjectiveFootwear = "";

        var footRoll = Math.floor(Math.random() * 20) + 1; // roll from 1-20
        if (footRoll > 0 && footRoll < 16) { // If the roll is between 1-5
            adjectiveFeet = Misc.randomelement(adjectivesFeet) + " ";
            adjectiveFootwear = Misc.randomelement(adjectivesFootwear) + " ";
            if (footRoll > 0 && footRoll < 7) {
                var adjectiveFeet1 = Misc.randomelement(adjectivesFeet);
                var adjectiveFeet2 = Misc.randomelement(adjectivesFeet);
                if (adjectiveFeet1 == adjectiveFeet2) {
                    adjectiveFeet2 = Misc.randomelement(adjectivesFeet);
                }
                adjectiveFeet = adjectiveFeet1 + ", " + adjectiveFeet2 + " ";

                var adjectiveFootwear1 = Misc.randomelement(adjectivesFootwear);
                var adjectiveFootwear2 = Misc.randomelement(adjectivesFootwear);
                if (adjectiveFootwear1 == adjectiveFootwear2) {
                    adjectiveFootwear2 = Misc.randomelement(adjectivesFootwear);
                }
                adjectiveFootwear = adjectiveFootwear1 + ", " + adjectiveFootwear2 + " ";
            }
        }

        var nakedFeetPlurals = ["bare feet", "heels", "arches", "big toes", "toes", "soles"];
        var nakedFeetSingulars = ["bare foot", "heel", "arch", "big toe", "toe", "sole"];
        var footwearPlurals = ["shoes", "boots", "sandals", "flip flops", "sneakers", "pumps", "heels", "socks", "stockings", "nylons", "fishnets", "hose"];
        var footwearSingulars = ["shoe", "boot", "sandal", "flip flop", "sneaker", "pump", "heel", "sock", "stocking", "nylons", "fishnets", "hose"];
        var nakedFeetPlural = adjectiveFeet + Misc.randomelement(nakedFeetPlurals);
        if (male) {
            footwearPlurals = Array.from(new Set([].concat(footwearPlurals, ["shoes", "boots", "sandals", "flip flops", "sneakers", "boots", "socks"])));
            footwearSingulars = Array.from(new Set([].concat(footwearSingulars, ["shoe", "boot", "sandal", "flip flop", "sneaker", "boot", "sock"])));
        }

        var nakedFeetSingular = adjectiveFeet + Misc.randomelement(nakedFeetSingulars);
        var footwearPlural = adjectiveFootwear + Misc.randomelement(footwearPlurals);
        var footwearSingular = adjectiveFootwear + Misc.randomelement(footwearSingulars);

        var plurals = Array.from(new Set([].concat(nakedFeetPlural, footwearPlural)));
        var singulars = Array.from(new Set([].concat(nakedFeetSingular, footwearSingular)));
        var nakedFoots = Array.from(new Set([].concat(nakedFeetSingular, nakedFeetPlural)));
        var footwears = Array.from(new Set([].concat(footwearSingular, footwearPlural)));
        var feets = Array.from(new Set([].concat(nakedFeetPlural, nakedFeetSingular, footwearPlural, footwearSingular)));

        var plural = Misc.randomelement(plurals);
        var singular = Misc.randomelement(singulars);
        var nakedFoot = Misc.randomelement(nakedFoots);
        var footwear = Misc.randomelement(footwears);
        var feet = Misc.randomelement(feets);

        //==========select from pool
        var candidates = [];
        var pool = Misc.getLewdPool();
        for (const primarytypename in pool) {
            if (pool.hasOwnProperty(primarytypename)) {
                const primarytype = pool[primarytypename];
                if (maintype == false || primarytypename == maintype) {
                    if (!primarytype[subtype]) {
                        subtype = false;
                    }
                    for (const secondarytypename in primarytype) {
                        if (primarytype.hasOwnProperty(secondarytypename)) {
                            const typepool = primarytype[secondarytypename];
                            if (subtype == false || secondarytypename == subtype) {
                                for (var i = 0; i < typepool.length; i++) {
                                    candidates.push(typepool[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
        var lewdmessage = Misc.randomelement(candidates);

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
            if (futaRoll != 1) {
                lewdmessage = lewdmessage.replace(/\bpussy\b/ig, "dick").replace(/\bvagina\b/ig, "dick").replace(/\bcunt\b/ig, "dick").replace(/\bclit\b/ig, "urethra").replace(/\blabia\b/ig, "foreskin");
            }
        }
        lewdmessage = smallname + lewdmessage;

        //====================return message=============

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
            false: ":question:"
        };
        var emoji = emojis[subtype];
        if (subtype === false) {
            subtype = "Random";
        }
        lewdmessage = [lewdmessage, emoji, subtype];
        return lewdmessage;

    }

    static getDefaultGTSNames(guildid) {
        var names = ["Mei", "Sucy", "2B", "Mt. Lady", "Vena", "Miku", "Lexi", "Baiken", "Ryuko", "Sombra", "Wolfer", "Gwen", "Mercy", "Gwynevere", "Tracer",
            "Aqua", "Megumin", "Cortana", "Yuna", "Lulu", "Rikku", "Rosalina", "Samus", "Princess Peach", "Palutena", "Shin", "Kimmy", "Zoey", "Camilla", "Lillian", "Narumi", "D.va"];
        var cleanishNames = names.join(", ");
        var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n").replace("Baiken,", "Baiken,\n").replace("Gwen,", "Gwen,\n").replace("Aqua,", "Aqua,\n").replace("Lulu,", "Lulu,\n").replace("Samus,", "Samus,\n");

        if (guildid === "261599167695159298") { // Krumbly"s ant farm only
            names = ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Lucy", "Ryuko", "Krumbly"];
            cleanishNames = names.join(", ");
            cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n");
            cleanNames = cleanNames.replace("Lucy,", "Lucy,\n");
        }
        if (guildid === "373589430448947200") { // r/Macrophilia Only
            names = ["Miau"];
            cleanNames = names[0];
        }
        if (guildid === "420402860027805696") { // Giantess Archive
            names = ["Brittany", "Bethany", "Alicia", "Katie", "Cali", "Asuna", "Cat", "Brianna", "Emily", "Alice", "Yuri", "Monica", "Brie", "Sierra"];
            cleanishNames = names.join(", ");
            cleanNames = cleanishNames.replace("Cali,", "Cali,\n");
            cleanNames = cleanNames.replace("Yuri,", "Yuri,\n");
        }
        if (guildid === "319534510318551041") { // The Big House Only
            names = names.concat(["Zem", "Ardy", "Vas"]);
            cleanishNames = names.join(", ");
            cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n");
            cleanNames = cleanNames.replace("Lucy,", "Lucy,\n");
        }
        if (guildid === "354709664509853708") { // Small World Only
            names = names.concat(["Docop", "Mikki", "Spellgirl"]);
            cleanishNames = names.join(", ");
            cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n");
            cleanNames = cleanNames.replace("Lucy,", "Lucy,\n");
        }
        if (guildid === "345390985150201859") { // The Giantess Club Only
            names = ["Yami", "Mikan", "Momo", "Nana", "Yui", "May", "Dawn", "Hilda", "Rosa", "Serena", "Palutena", "Wii Fit Trainer", "Lucina", "Robin", "Corrin", "Bayonetta", "Zelda", "Sheik",
                "Tifa", "Chun-li", "R. Mika", "Daisy", "Misty", "Gardevoir", "Lyn", "Cammy", "Angewomon", "Liara", "Samara", "Tali", "Miranda", "Cus", "Marcarita", "Vados", "Wendy", "Sabrina", "Cana", "Erza",
                "Levy", "Lucy", "Wendy Marvell"];
            cleanishNames = names.join(", ");
            cleanNames = cleanishNames.replace("Hilda,", "Hilda,\n");
            cleanNames = cleanNames.replace("Lucina,", "Lucina,\n");
            cleanNames = cleanNames.replace("Chun-li,", "Chun-li,\n");
            cleanNames = cleanNames.replace("Cammy,", "Cammy,\n");
        }

        return { "names": names, "cleannames": cleanNames, "totalnames": names.length };

    }

    static async getcustomGTSNames(uid) {
        var userDb = await dbs.user.load();

        var customName = [];
        if (userDb.people[uid]) {
            if (userDb.people[uid].names) {
                var namesObj = userDb.people[uid].names;
                Object.keys(namesObj).forEach(function(key) {
                    customName.push(key);
                });
            }
        }
        return customName;
    }

    static getLewdCounts(type) {
        var resultstring = "";
        var total = 0;
        var pool = Misc.getLewdPool();
        for (const key in pool[type]) {
            if (pool[type].hasOwnProperty(key)) {
                const element = pool[type][key];
                total += element.length;
                resultstring += "**" + Misc.capitaliseFirstLetter(key) + " " + Misc.capitaliseFirstLetter(type) + "s:** " + element.length + "\n \n";
            }
        }
        resultstring = "**Total " + Misc.capitaliseFirstLetter(type) + "s:** " + total + "\n \n" + resultstring;
        return resultstring;

    }

    static capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static getLewdPool() {
        return JSON.parse(fs.readFileSync("./db/lewds.json"));
    }
}

module.exports = Misc;
