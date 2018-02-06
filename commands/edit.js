const _ = require("../servers.js");
var data = _.load();
module.exports = {
      main: function(Bot, m, args, prefix) {
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        var guild = m.channel.guild
        if (!guild) {
            Bot.createMessage(m.channel.id, "Please use this command in a server channel");
            return;
        }
        if (m.author.id != guild.ownerID) {
            Bot.createMessage(m.channel.id, "You must be the server owner to run this command.");
            return;
        }
        if (!(data[guild.id])) {
            data[guild.id] = {}
            data[guild.id].name = guild.name
            data[guild.id].owner = guild.ownerID
            Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`);
            _.save(data)
            _.load()
        }
        if (args.toLowerCase().includes("prefix ")) {
            var prefix = args.replace(/prefix /ig, "")
            Bot.createMessage(m.channel.id, "Adding prefix: `"+prefix+"`");
            data[guild.id].prefix = prefix
            _.save(data)
            return;
        }
        /*
        if (args.toLowerCase().includes("ignore ")) {
            if (!m.channelMentions[0]) {
              Bot.createMessage(m.channel.id, "Please mention a channel to be ignored");
              return;
            }
            var channel = m.channelMentions[0]
            Bot.createMessage(m.channel.id, "Ignoring channel: `"+channel.name+"`");
            data[guild.id].prefix = prefix
            _.save(data)
            return;
        }
        */
        if (args.toLowerCase().includes("add ")) {
            if (args.toLowerCase().includes("mod ")) {
                if (m.roleMentions[0]) {
                    if (!data[guild.id].modRoles) {
                      data[guild.id].modRoles = {}
                    }
                    data[guild.id].modRoles[m.roleMentions[0].id] = true
                    _.save(data)
                    return;
                }
                if (m.mentions[0]) {
                    if (!data[guild.id].mods) {
                      data[guild.id].mods = {}
                    }
                    data[guild.id].mods[m.mentions[0].id] = true
                    _.save(data)
                    return;
                }
            }
        }
    },
    help: "Modify Server Settings (Owner only)"
}
