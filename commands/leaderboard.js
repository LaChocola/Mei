const _ = require("../people.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args, prefix) {
      function rank(obj) {
          var arr = [];
          var entries = Object.entries(obj);
          for (var entry of entries) {
              if (entry[1].adds) {
                  arr.push({
                      'key': entry[0],
                      'value': entry[1].adds
                  });
              }
          }
          arr.sort(function(a, b) { return a.value - b.value; });
          return arr.reverse();
      }
      var sorted = rank(data.people)
      if (args.toLowerCase().includes("global")) {
        var i = 1
        leaders = []
        for (person of sorted) {
          console.log(person);
          var user = Bot.users.filter(m => m.id == person["key"])[0]
          if (user && user.id != "309220487957839872") {
              if (person.value > 1) {
                leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} adds`)
                i++
              }
              if (person.value == 1) {
                leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} add`)
                i++
              }
          }
        }
        Bot.createMessage(m.channel.id, "Current *Global* Leaderboard:\n\n"+leaders.join("\n"));
        return;
      }
      var leaders = []
      var i = 1
      for (person of sorted) {
        console.log(person);
        var user = m.channel.guild.members.filter(m => m.id == person["key"])[0]
        if (user && user.id != "309220487957839872") {
            if (person.value > 1) {
              leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} adds`)
              i++
            }
            if (person.value == 1) {
              leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} add`)
              i++
            }
        }
      }
      Bot.createMessage(m.channel.id, "Current Guild Leaderboard:\n\n"+leaders.join("\n"));
    },
    help: "Member counts"
}
