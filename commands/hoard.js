const _ = require("../people.js");
var data = _.load();
module.exports = {
	main: function(Bot, m, args) {
    var name1 = m.cleanContent.replace(/!hoard /i, "")
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
    var url = m.channel.guild.members.get(id).avatarURL
		if (!(data.people[id]) || !(data.people[id].hoard)) {
		    Bot.createMessage(m.channel.id, `Could not find any hoard for **${name}**`);
        return;
		}
    var hoard = Object.keys(data.people[id].hoard)
    var rando =  hoard[Math.floor(Math.random() * hoard.length)]
    var origID = data.people[id].hoard[rando]
    var user = Bot.users.filter(m => m.id == origID)[0]
    var hash = user.avatar
    var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
    var index = `${hoard.indexOf(rando)+1} of ${hoard.length}`
    if (rando.includes("https://cdn.discordapp.com")) {
      const data = {
        "content": `A Random piece, from the hoard of **${name}**`,
        "embed": {
          "description": index,
          "color": 0xA260F6,
          "image": {
            "url": rando
          },
          "author": {
            "name": name,
            "icon_url": url
          },
          "footer": {
            "icon_url": og,
            "text": `Original post by ${user.username}`
          }
        }
      };
      Bot.createMessage(m.channel.id, data);
      return;
    }
    else {
      const data = {
        "content": `A Random piece, from the hoard of **${name}**`,
        "embed": {
          "description": index,
          "color": 0xA260F6,
          "title": rando,
          "author": {
            "name": name,
            "icon_url": url
          },
          "footer": {
            "icon_url": og,
            "text": `Original post by ${user.username}`
          }
        }
      };
      Bot.createMessage(m.channel.id, data);
      return;
    }
	},
	help: "Add custom names for !v and !g"
}
