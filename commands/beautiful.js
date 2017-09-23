const Jimp = require('jimp');

  module.exports = {
  	main: function(Bot, m, args) {
      var isThisUsernameThatUsername = function(member) {
        var memberName = member.nick || member.username
          if (memberName.toLowerCase() == m.author.username.toLowerCase()) {
            return true;
            }
          }
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member || m.author
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
          var pic = `https://images.discordapp.net/avatars/${m.author.id}/${m.author.avatar}.png?size=1024`

          if (m.mentions.length == 1) {
            var pic = `https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`
          }
            else if (m.mentions.length > 1) {
              Bot.createMessage(m.channel.id, "This Command can't be used with more than one mention")
              return;
            }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
          try {
            const bg = await Jimp.read("https://buttsare.sexy/495acb.jpg");
            const avy = await Jimp.read(pic);
            avy.resize(95, 106);
            bg.clone()
              .blit(avy, 253, 23)
              .blit(avy, 258, 224)
              .getBuffer(Jimp.MIME_PNG, function (err, buffer) {
                Bot.createMessage(m.channel.id, "", {
                  "file": buffer,
                  "name": "beautiful"+name+".png"
                })
              });
          } catch (error) {
            console.log(error);
            return Bot.createMessage(m.channel.id, "Something went wrong...");
          }
        });
  	},
  	help: "This is beautiful"
  }
