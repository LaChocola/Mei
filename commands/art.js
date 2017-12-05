module.exports = {
    main: function(Bot, m, args) {
          Bot.getMessages("356133586686181377", parseInt(5000)).then(function(msgs) {
            var art = {}
              for (var msg of msgs) {
                if (msg.content.includes("pastebin.com")) {
                  art[msg.content] = msg.author.id
                }
                if (msg.attachments[0]) {
                  art[msg.attachments[0].url] = msg.author.id
                }
              }
              Bot.sendChannelTyping(m.channel.id).then(async () => {
                var number = Math.floor(Math.random() * Object.entries(art).length);
                var list = Object.entries(art)
                var chosen = list[number]
                var author = m.channel.guild.members.get(chosen[1]).nick || m.channel.guild.members.get(chosen[1]).username
                var url = m.channel.guild.members.get(chosen[1]).avatarURL
                if (chosen[0].includes("pastebin.com")) {
                  const data = {
                    "content": "A Random piece by ***"+author+"*** from <#356133586686181377>~",
                    "embed": {
                      "color": 0xA260F6,
                      "title": chosen[0],
                      "url": chosen[0],
                      "author": {
                        "name": author,
                        "icon_url": url
                      }
                    }
                  };
                  Bot.createMessage(m.channel.id, data);
                  return;
                }
                else {
                  const data = {
                    "content": "A Random piece by ***"+author+"*** from <#356133586686181377>~",
                    "embed": {
                      "color": 0xA260F6,
                      "image": {
                        "url": chosen[0]
                      },
                      "author": {
                        "name": author,
                        "icon_url": url
                      }
                    }
                  };
                  Bot.createMessage(m.channel.id, data);
                }
              });
          });
          return;
  },
  help: "Show works from an artist channel. (Small World only)" // add description
}
