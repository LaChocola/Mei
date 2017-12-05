var request = require('request');
var request = request.defaults({
    jar: true
})
var cheerio = require('cheerio');
var URL = require('url-parse');

module.exports = {
    main: function(Bot, m, args) {
        var number = m.cleanContent.toLowerCase().replace("p", "").replace("!t", "")
        if (!isNaN(number)) {
            var j = request.jar();
            var cookie1 = request.cookie(`Refresh=http%3A%2F%2Fwww.hartsystems.com%2FScripts%2Frptgen.cgi%3Fid%3D3184%26j%3D28101%26s%3D33%26k%3D${number}%26viewer%3Dhttp%3A%2F%2Fwww.hartsystems.com%2FScripts%2F756_cssview.php`);
            var options = {
                url: `https://www.frys.com/search?cat=&query_string=${number}&storeNo=33`,
                headers: {
                    'Authorization': 'Basic aHYyODEwMTpmcnl2MDQ4OQ=='
                }
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var thing = $('div')[""]
                    console.log(thing);
                }
            }
            request(options, callback);
            return;
        }
    },
    help: "Clean stuff" // add description
}