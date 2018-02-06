var time = new Date().toISOString();
var request = require('request');
var request = request.defaults({
    jar: true
})
var j = request.jar();
var cheerio = require('cheerio');
var URL = require('url-parse');
var config = require("../etc/config.json");


module.exports = {
    main: function(Bot, m, args, prefix) {
        var name = m.author.nick || m.author.username
        var args = m.cleanContent.replace(`${prefix}ex `, "").toLowerCase().split(", ")
        var base1 = "https://exhentai.org/?f_doujinshi=0&f_manga=0&f_artistcg=0&f_gamecg=0&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=%22" + args.join("%22+%22") + "%22&f_apply=Apply+Filter"
        var baseMore = "https://exhentai.org/?f_doujinshi=0&f_manga=0&f_artistcg=0&f_gamecg=0&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=%22" + args.join("%22+%22") + "%22&f_apply=Apply+Filter"
        var pageToVisit = base1
        if (m.content.length < 4) {
            var pageToVisit = "https://exhentai.org/tag/female:giantess"
            var args = ["giantess"]
        }
        if (args.length > 1) {
            var pageToVisit = baseMore
        }
        console.log(pageToVisit);
        var cookie1 = request.cookie(config.tokens.exhentai.id);
        var cookie2 = request.cookie(config.tokens.exhentai.hash);
        var cookie3 = request.cookie('uconfig=dm_t');
        j.setCookie(cookie1, pageToVisit);
        j.setCookie(cookie2, pageToVisit);
        j.setCookie(cookie3, pageToVisit);
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            request({
                url: pageToVisit,
                jar: j
            }, function(error, response, body) {
                var link_array = []
                if (error) {
                    console.log("Error: " + error);
                }
                if (response.statusCode === 200) {
                    // Parse the document body
                    var $ = cheerio.load(body);
                    var thing = $('.id3').children()
                    var i = 0;
                    for (child in thing) {
                        i++
                        let child_thing = thing[child];
                        if (child_thing.type == 'tag') {
                            link_array.push({
                                name: child_thing.children[0].attribs.title,
                                link: child_thing.attribs.href,
                                pic: child_thing.children[0].attribs.src.replace("https://exhentai.org/", "https://ehgt.org/")
                            });
                        } else {
                            break;
                        }
                    }
                    if (link_array.length < 1) {
                        Bot.createMessage(m.channel.id, "No results found :(");
                        return;
                    }
                    const maths = Math.floor(Math.random() * link_array.length)
                    var number = maths + 1
                    var pairs = link_array[maths]
                    const data = {
                        "content": "Results on **Exhentai** for **" + args.join(", ") + "**",
                        "embed": {
                            "color": 0xA260F6,
                            "footer": {
                                "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
                                "text": "Searched by: " + name + ". Image " + number + " of " + link_array.length
                            },
                            "image": {
                                "url": pairs.pic
                            },
                            "author": {
                                "name": pairs.name,
                                "url": pairs.link
                            }
                        }
                    };

                    Bot.createMessage(m.channel.id, data);
                }
            });
        });
    },
    help: "Search Exhentai"
};
