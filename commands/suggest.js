module.exports = {
    main: function(Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}suggest `, "");
        var msg = msg.replace(/\bXXX\b/ig,`[name]`).replace(/"/ig, `'`).replace(/\b“\b/ig, `'`).replace(/\b”\b/ig, `'`).replace(`  `, ` `)
        var msg = `"`+msg.replace(/\bfeet\b/ig, `[feet]`)+`"`
        var person = m.author
        if (m.content == `${prefix}suggest`) {
            Bot.createMessage(m.channel.id, "Please add your suggestion. i.e. ``!suggest 'you were smushed by XXX when she forgot to check her seat before sitting down'``")
        } else {
            Bot.createMessage("446548104704032768", {
                content: `A new suggestion from: **` + person.username + "** (" + person.id + ") in the Guild: **" + m.guild.name + "**",
                embed: {
                    color: 0x5A459C,
                    description: msg
                }
            });
            var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
            var hand = hands[Math.floor(Math.random() * hands.length)]
            Bot.createMessage(m.channel.id, "Suggestion: ``" + msg + "`` Sent to Chocola " + hand);
        }
    },
    help: "Suggest something"
}
