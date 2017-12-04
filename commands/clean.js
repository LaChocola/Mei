module.exports = {
    main: function(Bot, m, args) {
        function isNumeric(num) {
            return !isNaN(num)
        }
        var coolkids = ["161027274764713984", "176975815072808960", "211019995214381059"];
        var coolkids = coolkids.push(m.channel.guild.ownerID)
        var member = m.channel.guild.members.get(m.author.id)
        var args = m.cleanContent.replace("!clean ", "").split(" ")

        var argsIterator = args.entries()
        for (let e of argsIterator) {
            if (isNumeric(+e[1])) {
                var int = +e[1]
            }
        }
        var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "]
        var response = responses[Math.floor(Math.random() * responses.length)]

        if (m.author.id == '161027274764713984') {
            Bot.createMessage(m.channel.id, 'Time to clean up')
            Bot.getMessages(m.channel.id, parseInt(int + 2)).then(function(msgs) {
                for (var msg of msgs) {
                    msg.delete();
                }
                Bot.sendChannelTyping(m.channel.id).then(async () => {
                    Bot.createMessage(m.channel.id, 'Cleaning~').then(a => {
                        setTimeout(function() {
                            a.delete();
                        }, 4000);
                    });
                });
            });
            return;
        } else if (m.author.id == m.channel.guild.ownerID) {
            if (m.mentions.length > 0) {
                var fuckery = ["FFS", "Fine", "I guess you work too", "Alright!", "Okay.."]
                var fuck = fuckery[Math.floor(Math.random() * fuckery.length)]
                Bot.createMessage(m.channel.id, fuck + " " + m.author.username + "** \nTime to clean up")
                Bot.getMessages(m.channel.id, parseInt(int)).then(function(msgs) {
                    for (var msg of msgs) {
                        if (msg.author.id == m.mentions[0].id) {
                            msg.delete();
                        }
                    }
                    Bot.sendChannelTyping(m.channel.id).then(async () => {
                        Bot.createMessage(m.channel.id, 'Cleaning~').then(a => {
                            setTimeout(function() {
                                a.delete();
                            }, 4000);
                        });
                    });
                });
            } else if (m.mentions.length < 0) {
                Bot.createMessage(m.channel.id, "You didnt mention anyone");
            }
        } else {
            Bot.createMessage(m.channel.id, response);
        }
    },
    help: "Clean stuff" // add description
}