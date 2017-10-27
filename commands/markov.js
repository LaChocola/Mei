const MarkovGen = require('markov-generator');
var time = new Date().toISOString();

module.exports = {
    main: async function (Bot, m, args) {
			var name1 = m.cleanContent.replace("!markov ", "")
      if (m.content.length < 8) {
        name1 = m.author.username
      }
      if (m.channelMentions.length > 0) {
        var channelName = " #" + m.channel.guild.channels.get(m.channelMentions[0]).name
        var name1 = name1.replace(channelName, "")
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
      var channel = m.channelMentions[0] || m.channel.id

      if (channel == "253371452189966336" || channel == "252636853616902156") {
        Bot.createMessage(m.channel.id, "I cant read that channel, please try a different one.")
        return;
      }
        var amount = 6000
        Bot.createMessage(m.channel.id, 'Indexing ' + amount + ' messages from **' + name + '** in *' + m.channel.guild.channels.get(channel).name + '*, Please wait.').then(a => {
          setTimeout(function() {
          a.delete()
        }, 10000);
      });
        Bot.sendChannelTyping(m.channel.id).then(async () => {
        let messages = await Bot.getMessages(channel, amount);


        messages = messages.filter(msg => msg.author.id === mentioned.id && !msg.content.includes("!") && !msg.content.includes("<@") && !msg.content.includes(".com")).map(msg => msg.content);
        let markov = new MarkovGen({
          input: messages,
          minLength: 6
        });
        var sentence = markov.makeChain();
        if (!(messages) || !(sentence)) {
          Bot.createMessage(m.channel.id, "Sorry, I couldn't find any messages from **" + mentioned.username + "** in `" + m.channel.name + "`")
          return;
        }
        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                title:  "\n \"" + sentence + "\"",
                timestamp: time,
                author: {
                  name: name,
                  icon_url: mentioned.avatarURL
                },
                footer: {
                      text: "-" + name + " 2017"
                    }
            }
        });
    });
    },
    help: "Markov and Watson"
}
