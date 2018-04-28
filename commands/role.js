module.exports = {
    main: function(Bot, m, args, prefix) {
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        var downs = [":thumbsdown::skin-tone-1:", ":thumbsdown::skin-tone-2:", ":thumbsdown::skin-tone-3:", ":thumbsdown::skin-tone-4:", ":thumbsdown::skin-tone-5:", ":thumbsdown:"]
        var down = downs[Math.floor(Math.random() * downs.length)]
        var guild = m.channel.guild
        m.content = m.content.toLowerCase()
        if (m.content == `${prefix}role` || m.content == `${prefix}role `) {
            Bot.createMessage(m.channel.id, "What do you want to do? | `!role add <role name>` | `!role remove <role name>`");
            return;
        }
        if (m.content.includes(`${prefix}role  `)) {
            Bot.createMessage(m.channel.id, "One space Please");
            return;
        }
        if (m.content.includes(`${prefix}role   `)) {
            Bot.createMessage(m.channel.id, "***One*** space Please");
            return;
        }
        var roles = {
            "big": "356005613630914560",
            "streamengine": "358727281377542146",
            "switch": "356005806681882656",
            "creator": "358537297538318336",
            "small": "356005120816971786",
            "neutral": "358535595892670465",
            "degenerate": "372625251819061249"
        }
        if (m.channel.guild.id == "326172270370488320") {
          var roles = {
            "giantess": "326479753806872586",
            "writers": "419777829979553793",
            "gentle": "424457908617609216",
            "artist": "326513572966432769",
            "switch": "326492362123640843",
            "expansion": "343903114484776961",
            "micro": "371363527388299283",
            "tiny": "326479817165766657",
            "nano": "388340430124613642",
            "giga": "422618197917696011",
            "giant": "326479986527567872",
            "furry": "326479916553994260",
            "monster boy/girl": "433835189425143808",
            "normies": "424414455951261716",
            "ask to dm": "428352641282736149",
            "cruel": "424457948220096513",
            "no dms": "419200356183179264",
            "no rps": "420375117990854656"
          }
        }
        if (m.channel.guild.id == "435239066225868800") {
          var roles = {
            "switch": "436776743936983055",
            "macro": "436776841701752832",
            "micro": "436776912539615232"
          }
        }
        if (m.channel.guild.id == "416487280237215744") {
          var roles = {
            "worshipper": "416496472926715917",
            "toy": "416852773196267521",
            "commoner": "416852902313721866",
            "switch": "418127170070642690",
            "rpfriendly": "420378132810301441",
            "rpunfriendly": "420378244316004362",
            "giantess": "416852995385327637",
            "goddess": "416853083633745939",
            "creator": "418657403672854529"
          }
        }
        if (m.channel.guild.id == "372587460800282625") {
          var roles = {
            "tiny": "372604586978181120",
            "giantess/giant": "372605057642004481",
            "normal sized": "376111382103326730",
            "giga": "376157347594371072",
            "mega": "376157449901703180",
            "macro": "376157502720573441",
            "micro": "376157654525149194",
            "tamaño normal": "377173536474660864",
            "gigante/giganta": "379310900210958340"
          }
        }
        if (m.channel.guild.id == "433471999184994304") {
          var roles = {
            "straight": "434428924144123904",
            "breasts": "437253713598480394",
            "death": "434429395852328960",
            "musk": "434429520682942465",
            "normal": "434381553066573824",
            "full tour vore": "434429672441511956",
            "no lewd": "435179926576955402",
            "taken": "435137851815100426",
            "dm unfriendly": "434396180298989569",
            "mega macro": "434383340976472065",
            "big": "434381635547299854",
            "predator": "434428839238828032",
            "single": "435137937051484172",
            "big*": "433481603256156160",
            "looking for owner": "434429999794225163",
            "soft vore": "434429394073681943",
            "digestion": "434429670545555467",
            "rough": "434429262989099008",
            "(dnd) team wow": "437343826802245652",
            "bi": "434428924605366275",
            "micro": "434380830295457793",
            "male": "434377518984724480",
            "gas": "434429520641130497",
            "gentle": "434429262616068117",
            "small": "433481481000714240",
            "extremely normal": "437345400211505163",
            "hard vore": "434429395545882634",
            "watersports": "434429259751096352",
            "insertion": "435516083693289482",
            "feet": "434429261072564234",
            "scat": "434429087654608908",
            "giga macro": "434383518009655296",
            "teasing": "437253611207262208",
            "smaller": "433481334200074240",
            "writer": "433685793337376788",
            "stink": "434429521396105217",
            "artist": "433685836823920640",
            "butts": "437253654311862272",
            "no roleplay": "434429809872076810",
            "cruel": "434453924406231040",
            "non-switch": "434428693058813962",
            "looking for pet": "434429999643361281",
            "tiny": "434380949489451008",
            "female": "434377486873133056",
            "no death": "434429397018214401",
            "futa": "434428922852147202",
            "prefers to be smaller": "434429808559259649",
            "tera macro": "434882461046931456",
            "normal*": "433481577096544276",
            "in dnd": "434821543504248853",
            "little": "434381123293020161",
            "furry": "434429261613629471",
            "gay": "434429086174150676",
            "smallest": "433479403473731595",
            "prefers to be bigger": "434429808135634944",
            "trans": "437346533956911125",
            "macro": "434381791026085890",
            "scalie": "434429522037833743",
            "avian": "434429522818105350",
            "asexual": "437253757739466752",
            "prey": "434428897405435904",
            "dm friendly": "434395988656914443",
            "gore": "434429397114683405",
            "switch": "434396480271548446",
            "streamer": "434429086232739841",
            "mouthplay": "434429670578978826",
            "crush": "434429087411470337",
            "speck": "434380266191192064",
            "bigger": "433481625679036418"
          }
        }
        if (m.channel.guild.id == "396122792531197952") {
          var roles = {
            "pirate party": "397360783216082946",
            "head of the giant party": "397360293052940298",
            "goddess": "397651429239816203",
            "human male": "397661187321626625",
            "tiny female": "397665523372130304",
            "liberal": "397985828653236234",
            "gods": "397653419718082561",
            "republicans": "396156426239606785",
            "liberal democrats (uk)": "398213298732138498",
            "giant party": "397196918926737409",
            "tiny party": "397119025223827456",
            "green party": "397184860252405771",
            "libertarian": "396157092047749131",
            "human female": "397661693238575115",
            "tiny male": "397663371404640256",
            "socialist": "397122591849971712",
            "micro": "397669886014259212",
            "head of the giantess party": "397360289307426816",
            "giant": "397659084037423115",
            "giantess": "397656534873800704",
            "dragon": "398212293470453773",
            "switch": "397968217890357248",
            "dragon nationalist": "398212875795300352",
            "democrats": "396155836248096768",
            "head of the tiny party": "397360295242235904",
            "giantess party": "397119269604950017"
          }
        }

        if (m.mentions.length > 0 && m.mentions[0].id != m.author.id) {
            Bot.createMessage(m.channel.id, "You can only assign roles to yourself");
            return;
        }
        if (m.content.includes("add")) {
            if (!m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "")
                if (roles[content]) {
                    var roleID = roles[content]
                    Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful added: " + content).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                            }, 5000) && setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            }, 5000)
                        })
                    })
                    return;
                } else {
                    Bot.createMessage(m.channel.id, content + ": Not found").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
            } else if (m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").split(" | ")
                var iterator = content.entries()
                var found = []
                var notFound = []
                for (let e of iterator) {
                    if (roles[e[1]]) {
                        var roleID = roles[e[1]]
                        Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    } else if (!roles[e[1]]) {
                        notFound.push(e[1])
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly added: " + found.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to add: " + notFound.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                return;
            }
        }
        if (m.content.includes("remove")) {
            if (!m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "")
                if (roles[content]) {
                    var roleID = roles[content]
                    Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful removed: " + content).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                            }, 5000) && setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            }, 5000)
                        })
                    })
                    return;
                } else {
                    Bot.createMessage(m.channel.id, content + ": Not found").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
            } else if (m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "").split(" | ")
                var iterator = content.entries()
                var found = []
                var notFound = []
                for (let e of iterator) {
                    if (roles[e[1]]) {
                        var roleID = roles[e[1]]
                        Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    } else if (!roles[e[1]]) {
                        notFound.push(e[1])
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly removed: " + found.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to remove: " + notFound.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                return;
            }
        }

    },
    help: "Assign your role. `!role add rolename`"
}
