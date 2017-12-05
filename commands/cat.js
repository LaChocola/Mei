var request = require('request');

module.exports = {
	main: function(Bot, m, args) {
    request('http://random.cat/meow', (err, res, body) => {
      var catURL = JSON.parse(body)
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

    });
	},
	help: "Random Cats"
}
