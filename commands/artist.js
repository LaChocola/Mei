const _ = require('../people.js');
var data = _.load();
module.exports = {
    main: function (Bot, m, args) {
        var name1 = m.cleanContent.replace(/!artist /i, '');
        var isThisUsernameThatUsername = function (member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        };
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var linkArray = [];
        var id = mentioned.id;
        var hands = [':ok_hand::skin-tone-1:', ':ok_hand::skin-tone-2:', ':ok_hand::skin-tone-3:', ':ok_hand::skin-tone-4:', ':ok_hand::skin-tone-5:', ':ok_hand:'];
        var hand = hands[Math.floor(Math.random() * hands.length)];
        if (!(data.people[id])) {
            data.people[id] = {};
            data.people[id].links = {};
        }
        if (!(data.people[id].links)) {
            data.people[id].links = {};
        }

        if (args.toLowerCase().includes('add ')) {
            if (mentioned.id !== m.author.id) {
                Bot.createMessage(m.channel.id, 'Okay....but that isnt you');
                return;
            }
            var incoming = name1.replace(/add /i, '').replace(': ', ' ').split(' ');
            if (data.people[id].links[incoming[0]]) {
                Bot.createMessage(m.channel.id, 'That\'s already been added, silly~');
                return;
            } else {
                if (incoming.length > 2) {
                    Bot.createMessage(m.channel.id, 'You should only be adding the name and the like, any other format is not supported. \n\nValid Example:\n`!artist add Patreon <https://patreon.com/Chocola>`');
                    return;
                }
                data.people[id].links[incoming[0]] = incoming[1];
                _.save(data);
                Bot.createMessage(m.channel.id, 'Added **' + incoming[0] + '** ' + hand);
                return;
            }
        }

        if (args.includes('remove')) {
            if (mentioned.id !== m.author.id) {
                Bot.createMessage(m.channel.id, 'Okay....but that isnt you');
                return;
            }
            var incoming = name1.replace('remove ', '').replace(': ', ' ').split(' ');
            if (data.people[id].links[incoming[0]]) {
                delete data.people[id].links[incoming[0]];
                _.save(data);
                Bot.createMessage(m.channel.id, 'Removed: **' + incoming[0] + ':** from your links ' + hand);
                return;
            } else {
                Bot.createMessage(m.channel.id, 'Sorry, I couldnt find**' + incoming[0] + ':** `' + incoming[1] + ' in your links');
                return;
            }
        }

        if (Object.keys(data.people[id].links).length === 0) {
            Bot.createMessage(m.channel.id, 'I could find any links for **' + name + '** :(');
            return;
        } else {
            var links = data.people[id].links;
            Object.keys(links).forEach(function (key) {
                linkArray.push(key + ': ' + links[key] + '\n');
            });
            Bot.createMessage(m.channel.id, {
                content: '',
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(data.people[id].links).length + ' links found for: **' + name + '**',
                    description: ' \n' + linkArray.join('\n'),
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    }
                }
            });
        }
    },
    help: 'Show artist links. `!artist | !artist <mention> | !artist add <name of link> <actual link> | !artist remove <name of link>`'
};
