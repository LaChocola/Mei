var request = require('request');

module.exports = {
    main: function(Bot, m, args, prefix) {
        request('http://aws.random.cat/meow', (err, res, body) => {
          if (res.statusCode == 200) {
            var catURL = JSON.parse(body);
            const data = {
                "embed": {
                    "color": 0xA260F6,
                    "image": {
                        "url": catURL.file
                    },
                    "author": {
                        "name": "| Here is your random cat:",
                        "icon_url": "https://buttsare.sexy/a5f22a.png"
                    }
                }
            };

            Bot.createMessage(m.channel.id, data);
          } else {
            // Random 403 error that sometimes occurs...
            Bot.createMessage(m.channel.id, "Sorry, no kitties at the moment. :frowning2: Please try again later.");
          }

        });
    },
    help: "Random Cats"
}
