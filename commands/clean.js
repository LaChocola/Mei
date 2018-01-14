module.exports = {
    main: function(Bot, m, args) {
        function isNumeric(num) {
            return !isNaN(num)
        }
        var coolkids = ["161027274764713984", "176975815072808960", "211019995214381059"];
        var coolkids = coolkids.push(m.channel.guild.ownerID)
        var member = m.channel.guild.members.get(m.author.id)
        var int = 10
        var args = m.cleanContent.replace("!clean ", "").split(" ")
        var argsIterator = args.entries()
        for (let e of argsIterator) {
            if (isNumeric(+e[1])) {
                var int = +e[1]
            }
        }
        var int = int+2
        var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "]
        var response = responses[Math.floor(Math.random() * responses.length)]
        if (m.mentions[0]) {
          if (m.author.id == '161027274764713984' || m.author.id == m.channel.guild.ownerID) {
              Bot.createMessage(m.channel.id, 'Time to clean up')
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
              return;
          }
        } else {
            Bot.createMessage(m.channel.id, response);
        }
    },
    help: "Clean stuff" // add description
}
