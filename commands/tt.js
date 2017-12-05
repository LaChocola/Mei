module.exports = {
    main: function(Bot, m, args) {
      if (m.author.id != "188694098339692544") {
        return;
      };
      function promiseTimeout(time) {
          return new Promise(resolve => setTimeout(() => resolve(), time));
      }
          Bot.createMessage(m.channel.id, `Oh hey`).then(() => {
              return promiseTimeout(2000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
          Bot.createMessage(m.channel.id, `So, since it is your birthday, I guess you need some gifts...right?`)
              return promiseTimeout(4000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
          Bot.createMessage(m.channel.id, `I am just some code, so I cant do much, but some of your friends came together and made some stuff for you.`)
              return promiseTimeout(6000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
          Bot.createMessage(m.channel.id, `So here is some art to celebrate your birthday, and we wish you the best`)
              return promiseTimeout(6000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
          const data = {
            "content": "Here is a special gift from <@271584533604728832>",
            "embed": {
              "color": 0xA260F6,
              "image": {
                "url": "https://cdn.discordapp.com/attachments/328023729458380800/370006386060427286/IMG_20171017_172912.jpg"
              },
              "author": {
                "name": "kasumikills",
                "icon_url": "https://cdn.discordapp.com/avatars/271584533604728832/4232737943358f2e1e9d823d941bb603.webp?size=1024"
              }
            }
          };
          Bot.createMessage(m.channel.id, data);
            return promiseTimeout(10000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
            const data = {
              "content": "and here is a special gift from <@314862805281013761>",
              "embed": {
                "color": 0xA260F6,
                "image": {
                  "url": "https://cdn.discordapp.com/attachments/361530249395306508/370302719296143369/TT_prez_2.jpg"
                },
                "author": {
                  "name": "Teniko",
                  "icon_url": "https://cdn.discordapp.com/avatars/314862805281013761/787010bb02e2d0ce85eb9598538c0f87.webp?size=1024"
                }
              }
            };
            Bot.createMessage(m.channel.id, data);
            return promiseTimeout(8000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
            Bot.createMessage(m.channel.id, "With love and code from <@161027274764713984>~");
            return promiseTimeout(5000);
          }).then(() => {
            Bot.sendChannelTyping(m.channel.id)
            Bot.createMessage(m.channel.id, "Happy Birthday TornadoTitan :tada: :tada: :tada:");
            return promiseTimeout(5000);
          }).catch(console.log);
    },
    help: "?"
}
