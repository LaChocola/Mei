'use strict';
const _ = require("../people.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args) {
        var args = args.toLowerCase()

        function capFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var prefix = '!'
        if (m.channel.guild.id == "187694240585744384") {
            var prefix = "?"
        }
        var male = false
        var names = ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Baiken", "Ryuko", "Sombra", "Wolfer", "Gwen", "Mercy", "Gwynevere", "Tracer",
            "Aqua", "Megumin", "Cortana", "Yuna", "Lulu", "Rikku", "Rosalina", "Samus", "Princess Peach", "Palutena", "Shin", "Kimmy", "Zoey", "Camilla", "Lillian", "Narumi", "D.va", "Satsuki"
        ];
        var cleanishNames = names.join(', ')
        var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n").replace("Baiken,", "Baiken,\n").replace("Gwen,", "Gwen,\n").replace("Aqua,", "Aqua,\n").replace("Lulu,", "Lulu,\n").replace("Samus,", "Samus,\n")
        var mentioned = m.mentions[0] || m.author
        var id = mentioned.id

        if (m.guild.id === "261599167695159298") { // Krumbly's Ant Farm Only
            var names = ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Lucy", "Ryuko", "Krumbly"];
            var cleanishNames = names.join(', ')
            var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
            var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
        }
        if (m.guild.id === "319534510318551041") { // The Big House Only
            var names = names.concat(["Zem", "Ardy", "Vas"])
            var cleanishNames = names.join(', ')
            var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
            var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
        }
        if (m.guild.id === "373589430448947200") { // r/Macrophilia Only
            var names = ["Miau"]
            var cleanNames = names[0]
        }
        if (m.guild.id === "354709664509853708") { // Small World Only
            var names = names.concat(["Docop", "Mikki", "Spellgirl"])
            var cleanishNames = names.join(', ')
            var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
            var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
        }
        if (m.guild.id === "345390985150201859") { // The Giantess Club Only
            var names = ["Yami", "Mikan", "Momo", "Nana", "Yui", "May", "Dawn", "Hilda", "Rosa", "Serena", "Palutena", "Wii Fit Trainer", "Lucina", "Robin", "Corrin", "Bayonetta", "Zelda", "Sheik",
                "Tifa", "Chun-li", "R. Mika", "Daisy", "Misty", "Gardevoir", "Lyn", "Cammy", "Angewomon", "Liara", "Samara", "Tali", "Miranda", "Cus", "Marcarita", "Vados", "Wendy", "Sabrina", "Cana", "Erza",
                "Levy", "Lucy", "Wendy Marvell"
            ];
            var cleanishNames = names.join(', ')
            var cleanNames = cleanishNames.replace("Hilda,", "Hilda,\n")
            var cleanNames = cleanNames.replace("Lucina,", "Lucina,\n")
            var cleanNames = cleanNames.replace("Chun-li,", "Chun-li,\n")
            var cleanNames = cleanNames.replace("Cammy,", "Cammy,\n")
        }


        if (m.guild.id === "296104080957505546") { // The Bean Empire Only
            var names = ["Claire", "Vi", "Awoodi", "Lexi", "Kiri", "Duni"];
            var cleanishNames = names.join(', ')
            var cleanNames = cleanishNames.replace("Duni,", "Duni,\n")
        }

        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        var customName = [];

        if (data.people[id]) {
            if (data.people[id].names) {
                var namesObj = data.people[id].names
                var names = [];
                Object.keys(namesObj).forEach(function(key) {
                    names.push(key);
                });
            }
        }

        var argsArray = args.split(' ')

        argsArray.forEach(function(arg) {
            var arg = capFirstLetter(arg)
            if (names.includes(arg) === true) {
                customName.push(arg)
            }
        });

        if (customName.length > 0) {
            var name = customName[Math.floor(Math.random() * customName.length)]
        } else {
            var name = names[Math.floor(Math.random() * names.length)]
        }

        if (data.people[id]) {
            if (data.people[id].names) {
                if (data.people[id].names[name] == "male") {
                    var male = true
                }
            }
        }

        var nameLength = names.length

        var butt = [
            "You were smushed under " + name + "'s butt while she played games",
            "You were sitting in " + name + "'s spot at the wrong time",
            "You were flattened by " + name + "'s round ass as she sat on the couch",
            "You were unwittingly crushed on the stool as " + name + " sat down at the bar.",
            "You were crushed under " + name + "'s butt as she rolled over in bed",
            "You were deprived of air between " + name + "'s cheeks",
            "You were crushed by " + name + "'s ass while they sat in traffic for hours",
            "You were drowned in " + name + "'s sweat in their booty shorts as they ran a mile",
            "You were squished by " + name + "'s ass as she grinded on someone in the club",
            "You were flattened on a mat by " + name + "'s butt as they practiced yoga",
            "You were inserted up " + name + "'s ass when she used you as a buttplug.",
            "You were obliterated by " + name + "'s tushe as they leaned back into the kitchen counter",
            "You fell down the crack of " + name + "'s butt to suffocate between their cheeks",
            "" + name + " used you as seat cushion as they put on their makeup",
            "After a long night of partying and drinking, " + name + " couldn't find you smushed against her butt cheek.",
            "" + name + " crushed you against their plump ass as they showered",
            "Hoping that you could catch her, " + name + " landed her big ass on you after falling out of a tree.",
            "You were crushed by " + name + "'s ass when they tripped over and fell on you",
            "You were suffocated by " + name + "'s butt when they wedged their phone in their pocket with you in it",
            "" + name + " got fed up with your jokes, so they planted their giant ass on you for so long you passed out from lack of air",
            name + " thought you ran away from her after she accidentally sat on your bed while you were asleep.",
            "You were continuously flattened underneath " + name + "'s fat ass as she biked down to the store.",
            "It was discovered that the human body produces vast amounts of heat, and you died of heat stroke deep between " + name + "'s butt cheeks.",
            name + " licked you and adhered your saliva-coated body to her friend’s rear. A playful slap against the cheek was all it took…",
            "You had always admired " + name + "'s beauty from inside your model world on her bedside table. She got pretty bored with you guys after a while, and the last thing you saw was the moon… er… her mooning you, before taking a seat.",
            "A single wrinkle on " + name + "'s rectum was an impressive sight. You would live here until she ate too many beans one day.",
            name + " was the hero of the city for stopping the fire. Unfortunately she did this by sitting on the engulfed building, and you were the last one left inside.",
            "You met your fate when " + name + " clenched her rectum while you were inside. For a moment it fixed your sore back",
            "To determine if you were strong enough to be her slave, " + name + " placed you between her cheeks and clenched. You weren't",
            "To determine if you were strong enough to be her slave, " + name + " placed you between her cheeks and clenched. You were, although that might be a bad thing...",
            name + " constructed a specialised chair to sit on, with a little cut out for you. She also developed a habit of not wearing pants around the house.",
            name + "'s friend dropped you between " + name + "'s butt cheeks while she slept. She woke up with a strange wet feeling in that spot.",
            "You were crushed under the rear of " + name + " as she sat down heavily on her chair. Forcibly pinned under the giant mass, you were helpless to stop her erratic movements as she masturbated the day away."
        ];
        var buttLength = butt.length
        var buttSmush = randomPick(butt)

        var sides = ["front", "back"]
        var side = sides[Math.floor(Math.random() * sides.length)]
        var types1 = ["panties", "underwear", "thong"]
        var type1 = types1[Math.floor(Math.random() * types1.length)]
        var types2 = ["panty", "thong", "underwear"]
        var type2 = types2[Math.floor(Math.random() * types2.length)]

        if (male) {
            var types1 = ["underwear", "boxers", "briefs"]
            var type1 = types1[Math.floor(Math.random() * types1.length)]
            var types2 = ["underwear", "underwear"]
            var type2 = types2[Math.floor(Math.random() * types2.length)]
        }
        var vagina = [
            name + " encased you inside her sex toy. The vibrations rattled your bones.",
            "You were ground into the walls of " + name + "'s vagina harshly, the juices stinging your eyes.",
            "You and your friends were adhered to " + name + "'s labia by her sticky secretion.",
            name + " forced you deep, deep inside her. So deep that you would never be able to escape.",
            "You were inside the building " + name + " decided to use as a dildo. After the windows broke you drowned in her juices.",
            "You were used up as a sex toy in a single indulgent night by " + name,
            "You and your friends were strapped together to add a bit more girth as " + name + "'s sex toy.",
            name + " was unimpressed by your height, and you failed to become her dildo. Instead you were relegated to 'back-door' duty.",
            name + " didn't know what was on her vulva but it felt good. She unknowingly ground you against her, disposed of for her pleasure.",
            "How was " + name + " supposed to know that you were stuck in her fingerprint as she 'flicked her bean'? You died from the juices.",
            name + " dropped you on her shoe and sat on it, grinding her lips against it and moaning in pleasure.",
            name + "'s muscular vagina proved your end.",
            "The prostitute " + name + " hired dropped you on her tongue before eating out " + name + " for a little extra stimulation.",
            "So many tinies were forced inside " + name + " that you thought you would drown in a sea of people before you would drown in her excretion.",
            name + "'s girlfriend strapped you to her strap-on and had a fun night with " + name,
            "You smiled, ready to surprise " + name + " as you got ready to enact your playful revenge prank. Sneaking into " + name + "'s room, you swiftly regretted your decision as a dildo rolled off the bed, landing onto you. Groaning, you were swiftly picked up and inserted into " + name + " as she tried not to be heard by her roommate."
        ];
        var vaginaLength = vagina.length
        var vaginaSmush = vagina[Math.floor(Math.random() * vagina.length)]

        var panty = [
            "You were dropped into " + name + "'s " + type1 + " for some lewd fun",
            "You were smooshed within " + name + "'s ass as she put on her " + type1 + "",
            "You were stuck in " + name + "'s " + type1 + " and driven up, between her cheeks",
            "You were jumping on " + name + "'s bed when she came back from her shower and sat on you, before putting on her " + type1 + "",
            "Feeling frisky " + name + " trapped you in the " + side + " of her " + type1 + "",
            "You were caught exploring " + name + "'s " + type2 + " drawer, and as a result, were forced to ride in them until her butt rubbed you out of existence",
            "While playing on " + name + "'s stomach, you tripped and accidentally rolled into her " + type1 + "",
            "You were playing hide and seek in " + name + "'s " + type1 + ", forgotten about, and washed with the rest of the dirty laundry",
            "You shrunk to nothing in the " + side + " of " + name + "'s " + type1 + ". They never even knew you were there",
            "" + name + " forced you to live in the " + side + " of her " + type1 + " after one too many tall jokes",
            "You were caught exploring " + name + "'s " + type2 + " drawer, and as a result, were forced to ride in them until her pussy rubbed you out of existence",
            "You lost yourself after an entire day inside " + name + "'s panties. Crawling inside you realise that humans weren’t designed to breathe in smells so intense.",
            name + " kidnapped you and decided that the real world was too scary, and kept you in her panties where you could enjoy her smell forever and ever...",
            name + "'s labia were surprisingly rigid as she pulled up her panties. The goose-bumped surface was the last thing you saw.",
            "The panties " + name + " wore were wedged tight inside her, with you along. She clumsily pulled them out, and the pinch was a little too hard.",
            "The feeling of you against her labia was too much for " + name + " to handle. You drowned in a froth of female excretion.",
            "You were crusted to " + name + "'s panties while they were discarded on the floor. She may not have noticed when she stepped on them.",
            name + " kidnapped you and decided that the real world was too scary, and kept you in her panties where you could enjoy her smell forever and ever...",
            name + "'s labia were surprisingly rigid as she pulled up her panties. The goose-bumped surface was the last thing you saw.",
            "The panties " + name + " wore were wedged tight inside her, with you along. She clumsily pulled them out, and the pinch was a little too hard.",
            "The feeling of you against her labia was too much for " + name + " to handle. You drowned in a froth of female excretion.",
            "You were crusted to " + name + "'s panties while they were discarded on the floor. She may not have noticed when she stepped on them."
        ];
        var pantyLength = panty.length
        var pantySmush = panty[Math.floor(Math.random() * panty.length)]

        var adjectivesFeet = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "powerful", "godly", "beautiful", "dirty", "filthy", "disgusting",
            "rancid", "giant", "massive", "moist", "sweat-soaked", "victim-covered", "soft", "lotion-scented"
        ]

        var adjectivesFootwear = ["stinky", "smelly", "sweaty", "damp", "pungent", "odorous", "sweet-scented", "huge", "stinky, sweaty", "dirty", "filthy", "disgusting", "rancid", "giant", "massive", "moist",
            "sweat-soaked", "victim-covered", "old", "worn out", "grimy"
        ]

        var adjectives = Array.from(new Set([].concat(adjectivesFeet, adjectivesFootwear)))

        var adjectiveFeet = ''
        var adjectiveFootwear = ''

        var roll = Math.floor(Math.random() * 20) + 1 // roll from 1-20
        if (roll > 0 && roll < 16) { // If the roll is between 1-5
            var adjectiveFeet = randomPick(adjectivesFeet) + " "
            var adjectiveFootwear = randomPick(adjectivesFootwear) + " "
            if (roll > 0 && roll < 7) {
                var adjectiveFeet1 = randomPick(adjectivesFeet)
                var adjectiveFeet2 = randomPick(adjectivesFeet)
                if (adjectiveFeet1 == adjectiveFeet2) {
                    var adjectiveFeet2 = randomPick(adjectivesFeet)
                }
                var adjectiveFeet = adjectiveFeet1 + ", " + adjectiveFeet2 + " "

                var adjectiveFootwear1 = randomPick(adjectivesFootwear)
                var adjectiveFootwear2 = randomPick(adjectivesFootwear)
                if (adjectiveFootwear1 == adjectiveFootwear2) {
                    var adjectiveFootwear2 = randomPick(adjectivesFootwear)
                }
                var adjectiveFootwear = adjectiveFootwear1 + ", " + adjectiveFootwear2 + " "
            }
        }

        var nakedFeetPlurals = ["bare feet", "heels", "arches", "big toes", "toes", "soles"]
        var nakedFeetPlural = adjectiveFeet + randomPick(nakedFeetPlurals)

        var nakedFeetSingulars = ["bare foot", "arch", "arches", "big toe", "toe", "sole"]
        var nakedFeetSingular = adjectiveFeet + randomPick(nakedFeetSingulars)

        var footwearPlurals = ["shoes", "boots", "sandals", "flip flops", "sneakers", "pumps", "heels", "socks", "stockings", "nylons", "fishnets", "hose"]
        var footwearPlural = adjectiveFootwear + randomPick(footwearPlurals)

        var footwearSingulars = ["shoe", "boot", "sandal", "flip flop", "sneaker", "pump", "heel", "sock", "stocking", "nylons", "fishnets", "hose"]
        var footwearSingular = adjectiveFootwear + randomPick(footwearSingulars)

        if (male) {
            var footwearPlurals = ["shoes", "boots", "sandals", "flip flops", "sneakers", "boots", "socks"]
            var footwearPlural = adjectiveFootwear + randomPick(footwearPlurals)
            var footwearSingulars = ["shoe", "boot", "sandal", "flip flop", "sneaker", "boot", "sock"]
            var footwearSingular = adjectiveFootwear + randomPick(footwearSingulars)
        }

        var plurals = Array.from(new Set([].concat(nakedFeetPlural, footwearPlural)))
        var plural = randomPick(plurals)

        var singulars = Array.from(new Set([].concat(nakedFeetSingular, footwearSingular)))
        var singular = randomPick(singulars)

        var nakedFoots = Array.from(new Set([].concat(nakedFeetSingular, nakedFeetPlural)))
        var nakedFoot = randomPick(nakedFoots)

        var footwears = Array.from(new Set([].concat(footwearSingular, footwearPlural)))
        var footwear = randomPick(footwears)

        var feets = Array.from(new Set([].concat(nakedFeetPlural, nakedFeetSingular, footwearPlural, footwearSingular)))
        var feet = randomPick(feets)

        var foot = [
            "" + name + " got tired of you teasing her for being so small that she shrank you down, put you under her " + feet + " and toyed with you for the rest of the day",
            "You were trapped in the fiber's of " + name + "'s carpet, unable to move out of the way of her " + feet,
            "You were crushed by " + name + "'s " + feet + ", not having noticed you",
            "You were stuck in " + name + "'s gym socks as she slipped them on",
            "You were smashed under " + name + "'s " + nakedFoot + " as she puts on her flip flops",
            "You were casually crushed under " + name + "'s " + nakedFoot + " as she went for a walk",
            "You were squeezed between " + name + "'s toes when she forgot you were there, worshiping her",
            "You were crushed underfoot by " + name + "'s " + nakedFoot + " when she lost her balence while putting her " + footwear + " on",
            "You were stomped flat beneath " + name + "'s " + singular + " during her rampage",
            "You were drowned by " + name + "'s foot sweat in her " + footwearSingular,
            "You were caught in " + name + "'s " + footwearPlural + " when she was putting them on",
            "You were shrunk even smaller and lost among the crevasses on " + name + "'s sole",
            "You were tangled in a rug when " + name + " stepped on you",
            "You were impaled by the heel of " + name + "’s new stilettos",
            "" + name + " got carried away testing how strong you were with her " + feet,
            "You were standing in the wrong spot as " + name + " kicked off her " + footwearPlural + " after coming back from work",
            "You were forgotten about under " + name + "’s toes after she put you in her " + footwear,
            "You were stomped on by " + name + " as she stepped out of bed in the morning",
            "You were suffocated while exploring inside " + name + "’s " + footwear,
            "You were ground into paste by " + name + "’s " + feet,
            "You were pressed flat between " + name + "’s " + plural,
            "You were snuffed out by " + name + " because she felt like it",
            "You were repeatedly stomped on by " + name + " because she wanted to show off her new pedicure",
            "" + name + " got tired of you asking for toe stuff that they decided to shrink you and force you to hold up the weight of their massive toe until it became too heavy for you and engulfed your tiny body",
            "" + name + " got fed up with you, they shrunk you only to be stomped and crushed under their " + feet,
            "You took a nap in " + name + "'s underwear drawer, but didn't wake up in time before she started getting dressed",
            name + " has you paint her toenails, but keeps shrinking you to half your current size as you finish each one",
            name + " became swiftly bored of toying with you, and dropped you into her shoes. She forgot you were in there the next day.",
            name + " kicked while you were between her toes, and despite your efforts to hold on you were launched out the window.",
            name + " accidentally stepped on your tiny friend, and now that you had no one, she stepped on you too; putting you out of your misery.",
            "After a pathetic life scrounging around " + name + "'s shoe you met your demise when she finally sprayed the smelly things with disinfectant; it made sense, you were a parasite in a way.",
            name + " strapped you to her toe ring. The smell, heat, and sweat were bad, but the fact that she only acknowledged you when showing you off to her friends was worse.",
            "It turns out that " + name + " was slightly perverse, and had a lot of fun sucking up your tiny body from between her friend’s toes.",
            "After your tongue was bloody from licking as much of " + name + " as you could, she tried to ‘hug’ you with her toes. Lungs aren’t designed for such pressure.",
            name + " tied you to the thong of her flip-flop and had a beach day. The endless rain of gravel-like sand spelled your end.",
            "You tripped out on the fumes while painting " + name + "'s toenails. She decided to continue herself and adhered your unconscious body under a layer of varnish.",
            "Even " + name + "'s tiniest toe was too powerful for you to resist. And the tiny splurt made her giggle.",
            "A stray keratin chunk hit you when " + name + " was clipping her toenails.",
            "You were so tiny the wrinkles of " + name + "'s foot were like hills to you. You spent the day exploring before she shifted and sent you to her toes, where she scrunched.",
            name + " yawned, rolling out of bed. Her " + nakedFeetSingular + " clenched slightly at the coldness in the air- not noticing your struggling body between her toes as she slipped on an old pair of " + footwearPlural
        ];
        var footLength = foot.length
        var footSmush = foot[Math.floor(Math.random() * foot.length)]

        var voreMouth = [
            "You were shoved in " + name + "'s mouth with some potato chips",
            "You were trapped in " + name + "'s sandwich during lunch",
            "You were sucked down " + name + "'s throat during an intense makeout session",
            "You were mashed to a pulp by " + name + "'s molars after saying 'What pretty teeth she had'",
            "You were inhaled by " + name + " as she yawned",
            "You were mistaken for a tic-tac when " + name + " had bad breath",
            "You were used by " + name + " as sprinkles on her ice cream",
            "You were swallowed after " + name + " got impatient while you cleaned her teeth",
            "You were turned into mush between " + name + "'s teeth",
            "You were drowned in a sea of " + name + "'s saliva",
            "Thinking you were resilient, " + name + " throws you in her mouth and pretends to chew you like gum, obliviously mashing you up in a bloody pulp.",
            "You were burned to death in a sea of " + name + "'s digestive acids",
            "You were quickly chewed up and devoured after accidentally getting wrapped up in " + name + "'s sushi roll.",
            "You were used to fuel " + name + " along with her soda for game night",
            "While wanting a bit of extra flavour, " + name + " puts you in her sandwich and begins to eat.",
            "You were forced to jump into " + name + "'s mouth for a snackrifice",
            "Your body was ripped to shreds after falling into " + name + "'s nutritious blended smoothie.",
            "You were trapped in " + name + "'s pudding as she moved in for the final bite",
            "You were stuck to " + name + "'s lower lip by her saliva for 20 minutes before her lips licking habit finally got you",
            "You were never seen again after attempting to go spelunking one night at Mt. Sleeping " + name + "",
            "You were dangerously cheesy after falling into " + name + "'s Cheetos and got eaten",
            "After an unfortunate mishap, you found yourself in " + name + "'s bowl of popcorn as she slowly eats away at it while watching a movie.",
            "You were gulped down by " + name + " along with her milk tea boba",
            "You became one with the cake as " + name + " stacked one of the layers on top of you, trapping you inside, waiting to be devoured.",
            "You were lost in the chip dip for " + name + "'s party, who was wondering where you went as she went for a bite...",
            "You were vaporized by a sudden sneeze from " + name,
            "You were grilled to death because of your carelessness when you fell into " + name + "'s pancake batter when she wasn't looking",
            "You were eaten by " + name + " because she mistook you for a grain of pepper in her meal",
            "You took a trip down " + name + "’s throat after taunting her",
            "You fell into " + name + "’s drink. She unknowingly swallowed you in a tidal wave of water",
            "You tried to sleep inside slumbering " + name + "’s open mouth. You were never seen again",
            "You were thrown into the abyss of " + name + "'s mouth because she was hungry",
            name + " was cooking a meal for the two of you to share, but you were accidentally cooked into the food.",
            "After accidentally getting coated in chocolate while baking, " + name + " bit hard into your crunchy shell, thinking you were one of the many chocolate bars you two made.",
            "You were burned and drowned in " + name + "'s hot coffee in the morning, shortly before being gulped down.",
            name + " sucks on your torso, before biting down to get to your chewy centre.",
            "You swam happily through " + name + "'s dessert. She thought the crunch was a piece of cookie.",
            "Despite your best efforts, " + name + "'s uvula was simply too slippery to hold onto, and her friend mistook your screaming down her gullet for " + name + "'s own scream.",
            "Unfortunately all of you were only the garnishing on " + name + "'s birthday cake. Her and her friends liked it, you guys, not so much.",
            name + " repeatedly beat you against the roof of her mouth to make sure you were nice and tired for going down her gullet.",
            "The tooth of " + name + " held you in place at your midsection. The tiniest amount of pressure would surely spell your death...",
            "Unfortunately you simply couldn't escape the bowl of cereal, and would die while inside " + name + "'s cheerio.",
            name + " thought it was funny that you could swim in her soup. Not for long as she forgot you were there and continued her meal.",
            name + " rolled you up into her roll of sushi and enjoyed a tasty lunch.",
            name + " didn't notice a micro drop into her drink as she went for a sip. Your tiny body barely managed to slip under her tongue, pinned and unnoticed as she got ready to start the day.",
            "Worn and ragged, you weakly let " + name + "'s tongue pin you under it after a lengthy struggle, her saliva washed over your entire body as she went about her day."
        ];
        var voreLength = voreMouth.length
        var voreSmush = voreMouth[Math.floor(Math.random() * voreMouth.length)]

        var handPlay = [
            "You were crushed in " + name + "'s hands during a sensual massage",
            "You were accidentally ripped in half during hand play with " + name + "",
            "You were flicked across the room by " + name + ", splattered on impact against the glass wall of the ant farm",
            "" + name + " applauded a show, but forgot you were in her hands",
            "You were slowly squashed between " + name + "'s fingers when she was bored at work",
            "" + name + " smacked you, believing you to be a mosqituo",
            "" + name + " pinched your head and squeezed it, making it pop",
            "" + name + " crushed you as she punched a punching bag with you taped on it",
            "" + name + "'s fist slammed down on you as she lost at a video game",
            "" + name + " brushed you off her shoulder to have you fall to your death",
            "You were drowned in nail polish as " + name + " painted her nails",
            "You were grinded to dust as " + name + " filed her nails",
            "You drowned as " + name + " washed her hands with you",
            " You were crushed between " + name + "'s fingers as she cracked them",
            "You were squashed under " + name + "'s fingers as she tapped them idly",
            "" + name + " forcibly tears off your clothing with her fingers and begins to play with your private areas",
            name + " cruelly berated you for your size as she poked your shrunken genitals. It appears she didn’t know her own strength and her fingertip was quite painful.",
            "An entire day riding around on " + name + "'s shoulder ended in disaster when she answered her phone. The person on the opposite end heard your death under her wrist.",
            "You were so tiny that you could fit in the folds of " + name + "'s fingerprint. She decided the best way to get rid of her infestation was a hand-soaking.",
            "Your body was strained to the max by being placed inside " + name + "'s ring and finger. She didn't really acknowledge you after that.",
            name + " crushed you under her thumb after a brief game of 'run around her palm and try not to get squished.'",
            "You were giving " + name + " a palm reading when you tickled her a little too much and she involuntarily bawled up her fist.",
            "You were covered in perfume and used as a bar of soap for " + name + " , unfortunately your body wasn't as strong as she hoped."
        ];
        var handLength = handPlay.length
        var handSmush = handPlay[Math.floor(Math.random() * handPlay.length)]

        var proposal = [
            "" + name + " accepted your proposal and you end up as the jewel on " + name + "'s wedding ring",
            "" + name + " traded you in to pay for her wedding dress",
            "" + name + " puts you on top of the wedding cake, but eventually forgets about you when having a slice",
            "You ended up getting married to " + name + "'s sole instead.",
            "You promised to stay with " + name + " until death tore you apart. But after a few days, " + name + " got bored of you, and tears YOU apart.",
            "You got sucked into " + name + "'s mouth and swallowed during your first kiss.",
            "You were squashed between " + name + "'s toes during her honeymoon as she stirred in her sleep.",
            "You live every day of you life happily as " + name + "'s tiny husbando",
            "You didn't read the prenup and end up as " + name + "'s personal slave.",
            "" + name + " was disgusted with you, so she decided it would be best to turn into a little red stain.",
            "You were crushed under the bouquet at " + name + "'s wedding.",
            "You were the gemstone for the engagement ring " + name + " received from her girlfriend.",
            name + " was so hungover after your wedding last night she didn't even remember dropping you into her panties. You drowned in her sweat while she danced.",
            name + " found you on your bucks night before your wedding. Not even your friends were spared from her dangerous heels.",
            "You were the groom on top of your own wedding cake with " + name + " . Unfortunately she didn't realise you didn't eat that part."
        ];
        var proposalLength = proposal.length
        var proposalSmush = proposal[Math.floor(Math.random() * proposal.length)]

        var legs = [
            "You were squashed by " + name + "'s thighs when she folded her legs",
            "You were smooshed between " + name + "'s thighs as she put on her leggings",
            "You were unable to keep your grip while climbing " + name + "'s thighs and fell to your death",
            "You were ground into paste by " + name + "'s thigh when she crossed her legs in the meeting room",
            "You were crushed between " + name + "'s thighs as she clapped them excitedly at a game",
            "You were crushed in the under knee as " + name + " squated down",
            "You were squished as " + name + "'s calf smacked her thigh while running",
            "You were Squashed by " + name + "'s knee as they knelt to grab something",
            "" + name + " calves crushed you as she crossed them while waiting for the bus",
            "" + name + "'s thighs ended your life as she danced the night away, clapping you between them",
            "You drowned in " + name + "'s lotion as she oiled her legs",
            "You were cut to pieces as " + name + " shaved her legs",
            "As " + name + " streched they suffocated you between her legs",
            "You drowned in " + name + "'s sweat inside her yogapants on a hot summer day",
            "Your tiny body was trapped between thigh flesh when " + name + " sat down without looking",
            name + "'s thighs proved to be too much to handle when you decided to re-enact the garbage dump scene from A New Hope.",
            "Your tiny body was absolutely shredded when " + name + " pulled her fishnets upwards.",
            name + " repeated squeezed her thighs together, with you between, until not even a trace of you remained.",
            name + " strut her stuff with you dangling from her anklet.",
            "You were sitting on " + name + "'s knee when she heard a hilarious joke. A 'knee-slapping' joke even...",
            "You were wedged into the crease between " + name + "'s thigh and crotch. You didn't survive when she put her legs together.",
            "You were rubbed onto " + name + "'s shin roughly after she bruised it. It seems you had even more bruises afterwards."
        ];

        var legsLength = legs.length
        var legsSmush = legs[Math.floor(Math.random() * legs.length)]

        var breasts = [
            "You were squished between " + name + "'s breasts. She forgot you were there and moved in her sleep",
            "You were crushed between " + name + "'s breasts, you pervert!",
            "You were exploring " + name + "'s breasts and were forgotten about when she took a shower",
            "You were suffocated in " + name + "'s cleavage",
            "You were clumsy and fell to your death while standing on " + name + "'s nipple",
            "You were suffocated by " + name + "'s boobs as she put on her Bra",
            "" + name + "'s nipple swallowed you whole as you were exploring",
            "You were caught in " + name + "'s underboob, forever lost...",
            "You were crushed by " + name + "'s breasts as she rested them on a desk",
            "You were crushed by " + name + "'s breasts while dangling from her necklece",
            "" + name + "'s Boobs flatted you as they bounced up and down while she ran",
            "You were constantly crushed as " + name + "'s boobs crushed you to the floor while she was doing push ups",
            "You drowned in " + name + "'s bikini top as she decided to swim",
            "Trapped between " + name + "'s cleavage, you drowned by her sweat as she worked",
            "" + name + "'s breasts clapped together, crushing you, as she was in a bumpy car ride",
            "You were crushed against " + name + "'s boobs as she hugged someone",
            "You were flattened in " + name + "'s bra as she stuffed you in there, hoping to keep you safe.",
            "You were smushed onto the ground as " + name + " tripped and smashed her big breasts against your tiny body.",
            "You were made into a splattered smear once " + name + " squished you between her breasts, checking to see how durable you were.",
            "You were flattened and trapped in one of the bras in a lingerie store after " + name + " tried one on with you inside.",
            name + "'s thought that paizuri at your size would be fun! Unfortunately she didn’t know her strength, and your bones were no match for boob flesh.",
            "Someone your size could very easily fall into many places. It happened the one you would never come out of was " + name + "'s nipple hole.",
            "In a feat of strength befitting the titan Atlas, you held up the infinite weight of " + name + "'s boob. Unlike Atlas, you weren’t a god, and the steamy meat proved too much for you.",
            name + " poked you with her erect nipple so hard you fell over and got bulldozed by her giant tit.",
            "The supple flesh of " + name + "'s breast was tantalising until she noticed a little pervert there. She jiggled her boobs until you were crushed.",
            name + " slipped you into her sports bra while she jogged. You drowned in the sweat.",
            "After dancing around on " + name + "'s nipple you fell off after she giggled. The small drop to her areola was too great.",
            name + " hung you from her new nipple-piercing."
        ];
        var breastLength = breasts.length
        var breastSmush = breasts[Math.floor(Math.random() * breasts.length)]

        var misc = [
            "You were used as token for a session of Dungeons and Tinies by " + name + " and crushed accidently under d20",
            "You were captured by " + name + " and become a sweat absorber",
            "You were suffocated under " + name + "'s belly as she laid on you",
            "You were drowned in the Washing Machine because " + name + " forgot you're in her sock",
            "You were trying to escape " + name + "'s room but end up lost in the jungle of carpet fibers",
            "You were caught masturbating to " + name + " while she slept. You had no chance of survival",
            "You were shrunk into nothingness on " + name + "'s body",
            "You were caught in " + name + "'s bellybutton and forgotten about",
            "You were broken when " + name + " broke wind",
            "You were trapped and forgotten inside " + name + "'s ear after getting wax-cleaning duty",
            "You were smeared into " + name + "'s armpit, trapped on a stick of deodorant",
            "You were lost in " + name + "'s pubic forest after trying to explore it without telling her first",
            "You were stuck to a tissue when " + name + " had a cold and sneezed",
            "You were stuck to a tissue when " + name + " had some fun RP-ing",
            "You were standing a little too close to " + name + "'s 'nightime toy' while she was using it",
            "You were flattened when " + name + " rolled over onto you in her sleep",
            "You were ground into paste by " + name + "'s pen as she dropped it after jotting some notes",
            "You were squashed by " + name + "’s eyelids when she blinked",
            "You were trapped when " + name + " came into her room, and dropped a load of dirty cloths on the floor",
            "" + name + " cried because she thought she smushed you, and you drowned in her tears",
            "" + name + " ties you to a ceiling fan and turns it to max power as she stays cool in the summer heat",
            "You received an unfortunate lesson in human anatomy when you drowned in " + name + "'s vaginal fluid, and it was such a bother rescuing your icky body from so deep inside her.",
            "Your hometown learned a valuable lesson: " + name + "'s saliva was harder to stay afloat in than water. " + name + " just giggled high above after she spat.",
            name + " simply enjoyed a day at the spa you worked at. Unfortunately your job was massager. Not the masseuse, the massager; a disposable one at that…",
            "You hugged onto the giant monolithic strand for dear life, but it helped you little against the swirl-patterned behemoth. " + name + " sneakily scratched her bush, hoping no one saw.",
            name + " showed you to a crowd of ravenous school girls. She smiled smugly in the distance as you were overwhelmed with prods and tickles. " + name + " returned finally… to inform them they could keep you.",
            name + " decided to place you in the crook of her knee for whatever reason. She dangled her feet behind her head playfully, crushing you… that was why.",
            "You were on the side of Earth that wasn’t being inserted into " + name + "'s Lovecraftian womanhood. The ‘luck’ was short lived as the juices quickly overwhelmed the oceans, and a flood of gooey liquid engulfed the globe.",
            "You were strapped to " + name + "'s sex toy for a night of fun. That night quickly became a week, then a month. Eventually she removed the strap and you were still crusted to the plastic.",
            name + " cruelly concocted an experiment, with your extremely tiny self as the subject. Results were conclusive: it was indeed possible to kill something so small by breathing on it. If it was the heat, pressure, or fear however… more tests needed to be done.",
            "A funny joke played on " + name + " made her squeal in fear. At your size, the sound made your head explode.",
            name + " decided to exercise, which would make her sweaty. Apparently, you weren’t as absorbent of a sweat rag as she hoped, and after being used as such ended up in her absolutely stench-ridden locker, where you suffocated.",
            "While making armpit farts " + name + " forgot you were in her hand. At least her pits smelled like deodorant.",
            "You were used as a toy for " + name + " during one of her live camshows",
            "Your life as a human dildo was cut short when " + name + " decided you would be better suited to be her new butt-plug.",
            "After minutes of trying " + name + " couldn't fish you out of her vagina. She decided to wait until you starved and then just wiggle her hips until you fell out.",
            "You danced a jig on " + name + "'s expanded clitoris. The thing was too slippery however, and you tumbled down and fell to your death.",
            name + " was harsh with her human dildos, and they never lasted for more than a month. That was your new job.",
            "You lived your life inside a tiny city built in " + name + "'s womanhood. Unfortunately she didn't know about this and decided to have some fun with her vibrator."
        ];
        var miscLength = misc.length
        var miscSmush = misc[Math.floor(Math.random() * misc.length)]

        if (male) {
            var smush = Array.from(new Set([].concat(butt, foot, panty, voreMouth, handPlay, legs, proposal, misc)))
            var smush1 = smush[Math.floor(Math.random() * smush.length)]
            var smush1 = smush1.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var pantySmush = pantySmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var miscSmush = miscSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var buttSmush = buttSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var handSmush = handSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var legsSmush = legsSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var voreSmush = voreSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var footSmush = footSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
            var proposalSmush = proposalSmush.replace(/ her /ig, " his ").replace(/ she /ig, " he ").replace(/ GTS /ig, " GT ").replace(/ breasts /ig, " chest ").replace(/ pussy /ig, " dick ")
        } else if (male != true) {
            var smush = Array.from(new Set([].concat(butt, vagina, panty, foot, voreMouth, handPlay, legs, proposal, breasts, misc)))

            var smush1 = smush[Math.floor(Math.random() * smush.length)]
        }

        var slength = smush.length

        if (m.content.toLowerCase() === `${prefix}v length`) {
            var total = slength
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    description: "**Names Availible: **" + nameLength + "\n " + cleanNames + "\n \n**Total Smush's:** " + total + "\n \n**Butt Smush's:** " + buttLength + "\n**Vagina Smush's:** " + vaginaLength +
                        "\n**Panty Smush's:** " + pantyLength + "\n**Foot Smush's:** " + footLength + "\n**Vore Death's:** " + voreLength + "\n**Hand Smush's:** " + handLength + "\n**Leg Smush's:** " + legsLength +
                        "\n**Boob Smush's:** " + breastLength + "\n**Misc Smush's:** " + miscLength + "\n**Proposal Smush's:** " + proposalLength
                }
            });
        }
        if (m.content.toLowerCase() == `${prefix}v someone`) {
            var members = m.channel.guild.members;
            var blacklisted = ["309220487957839872"]
            var people = []
            members.forEach(function(member) {
                if ((member.status != "offline")) {
                    if (blacklisted.indexOf(member.id) > -1) {
                        return;
                    } else {
                        people.push(member.id)
                    }
                }
            });
            var person = people[Math.floor(Math.random() * people.length)]
            Bot.createMessage(m.channel.id, "<@" + person + ">, " + smush1)
        }

        if (m.content.toLowerCase().startsWith(`${prefix}v`) && m.content.toLowerCase() != `${prefix}v length` && m.content.toLowerCase() != `${prefix}v someone`) {
            var tellem = "<@" + m.author.id + '>, '
            if (m.mentions.length > 0) {
                var smushee = m.channel.guild.members.get(m.mentions[0].id).nick || m.mentions[0].username
                var tellem = "**" + smushee + ",** "
            }

            if (args.indexOf("butt") > -1 || args.indexOf("ass") > -1 || args.indexOf("bum") > -1 || args.indexOf("bums") > -1 || args.indexOf("butts") > -1) {
                Bot.createMessage(m.channel.id, tellem + buttSmush);
                return;
            } else if (args.indexOf("vagina") > -1 || args.indexOf("pussy") > -1 || args.indexOf("insertion") > -1 || args.indexOf("cunt") > -1 || args.indexOf("cunny") > -1) {
                Bot.createMessage(m.channel.id, tellem + vaginaSmush);
                return;
            } else if (args.indexOf("proposal") > -1 || args.indexOf("marriage") > -1 || args.indexOf("marry") > -1 || args.indexOf("wed") > -1) {
                Bot.createMessage(m.channel.id, tellem + proposalSmush);
                return;
            } else if (args.indexOf("panty") > -1 || args.indexOf("panties") > -1 || args.indexOf("underwear") > -1 || args.indexOf("thong") > -1 || args.indexOf("thongs") > -1) {
                Bot.createMessage(m.channel.id, tellem + pantySmush);
                return;
            } else if (args.indexOf("foot") > -1 || args.indexOf("feet") > -1 || args.indexOf("foote") > -1) {
                Bot.createMessage(m.channel.id, tellem + footSmush);
                return;
            } else if (args.indexOf("vore") > -1 || args.indexOf("mouth") > -1) {
                Bot.createMessage(m.channel.id, tellem + voreSmush);
                return;
            } else if (args.indexOf("hand") > -1 || args.indexOf("hands") > -1) {
                Bot.createMessage(m.channel.id, tellem + handSmush);
                return;
            } else if (args.indexOf("legs") > -1 || args.indexOf("leg") > -1 || args.indexOf("thighs") > -1) {
                Bot.createMessage(m.channel.id, tellem + legsSmush);
                return;
            } else if (args.indexOf("boobs") > -1 || args.indexOf("breasts") > -1 || args.indexOf("breast") > -1 || args.indexOf("boob") > -1 || args.indexOf("tit") > -1 || args.indexOf("tits") > -1) {
                Bot.createMessage(m.channel.id, tellem + breastSmush);
                return;
            } else if (args.indexOf("misc") > -1 || args.indexOf("alt") > -1 || args.indexOf("other") > -1) {
                Bot.createMessage(m.channel.id, tellem + miscSmush);
                return;
            } else {
                Bot.createMessage(m.channel.id, tellem + smush1);
                return;
            }
        }
    },
    help: "A Violent Smush"
}