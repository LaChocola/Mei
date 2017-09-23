const _ = require("../people.js");
var data = _.load();
module.exports = {
	main: function(Bot, m, args) {
    	var name1 = m.cleanContent.replace("!names ", "")
			function capFirstLetter(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}
      var isThisUsernameThatUsername = function(member) {
        var memberName = member.nick || member.username
        if (memberName.toLowerCase() == name1.toLowerCase()) {
          return true;
          }
        }
    var member = m.guild.members.find(isThisUsernameThatUsername)
    var mentioned = m.mentions[0] || member || m.author
    var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
    var artists = data.people
    var nameArray = []
    var id = mentioned.id
    var hands = [ ":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
    var hand = hands[Math.floor(Math.random() * hands.length)]
		if (!(data.people[id])) {
			data.people[id]= {};
		}
    if (!(data.people[id].names)) {
			data.people[id].names = {}
    }
    if (args.includes("add")) {
      if (mentioned.id != m.author.id) {
        Bot.createMessage(m.channel.id, "Okay....but that isnt you");
        return;
      }
      var incomingEntries = name1.replace("add ", "").replace(": ", " ").split(" ")
			var incoming = [];
			var iterator = incomingEntries.entries()
			for (let e of iterator) {
				incoming.push(capFirstLetter(e[1]))
			}
      if (data.people[id].names[incoming[0]]) {
        Bot.createMessage(m.channel.id, "That's already been added, silly~");
        return;
      }
      else {
				if (incoming.indexOf("Male") > -1) {
					data.people[id].names[incoming[0]] = "male"
					_.save(data)
					Bot.createMessage(m.channel.id, "Added **" + incoming[0] + "** " + hand);
					return;
				}
				else {
					data.people[id].names[incoming[0]] = "female"
					_.save(data)
					Bot.createMessage(m.channel.id, "Added **" + incoming[0] + "** " + hand);
					return;
				}
      }
    }
    if (args.includes("remove")) {
      if (mentioned.id != m.author.id) {
        Bot.createMessage(m.channel.id, "Okay....but that isnt you");
        return;
      }
      var incoming = name1.replace("remove ", "").replace(": ", " ").split(" ")
      if (data.people[id].names.indexOf(incoming[0]) > -1) {
        delete data.people[id].names[incoming[0]]
        _.save(data)
        Bot.createMessage(m.channel.id, "Removed: **" + incoming[0] + "** from your names list" + hand);
        return;
      }
      else {
        Bot.createMessage(m.channel.id, "Sorry, I couldnt find**" + incoming[0] + " in your names list");
        return;
      }
    }
    if (Object.keys(data.people[id].names).length < 1) {
      Bot.createMessage(m.channel.id, "I could find any names list for **" + name + "** :(");
      return;
    }
    else {
			var names = data.people[id].names
      Object.keys(names).forEach(function(key){
         nameArray.push(key);
      });
      Bot.createMessage(m.channel.id, { content: "",
        embed: {
            color: 0xA260F6,
            title:  Object.keys(data.people[id].names).length + " names used by **" + name + "**",
            description: " \n" + nameArray.join("\n"),
            author: {
              name: name,
              icon_url: mentioned.avatarURL
            }
        }
    });
    }

	},
	help: "Add custom names for !v and !g"
}
