"use strict";

const qs = require('querystring')
const request = require('request').defaults({
    jar: true
})
const j = request.jar();
const cheerio = require('cheerio');
var config = require("../etc/config.json");
const defaultQuery = {
    f_doujinshi: 0,
    f_manga: 0,
    f_artistcg: 0,
    f_gamecg: 0,
    f_western: 0,
    'f_non-h': 0,
    f_imageset: 0,
    f_cosplay: 0,
    f_asianporn: 0,
    f_misc: 0,
    f_apply: 'Apply Filter',
}

module.exports = {
    main: function(Bot, m, args, prefix) {
        if (m.channel.nsfw == false) {
            Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
            return;
        }
        var name = m.author.nick || m.author.username
        var args = m.cleanContent.replace(`${prefix}ex`, "").replace(`${prefix}ex `, "").toLowerCase().split(", ")
        var search = args.join(' ')
        if (!search)
            search = 'giantess'
        var q = qs.encode(Object.assign({
            f_search: search
        }, defaultQuery))
        var pageToVisit = `https://exhentai.org/?${q}`
        var cookie1 = request.cookie(config.tokens.exhentai.id);
        var cookie2 = request.cookie(config.tokens.exhentai.hash);
        var cookie3 = request.cookie('sl=dm_1');
        j.setCookie(cookie1, pageToVisit);
        j.setCookie(cookie2, pageToVisit);
        j.setCookie(cookie3, pageToVisit);
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            request({
                url: pageToVisit,
                jar: j
            }, (error, response, body) => {
                var link_array = []
                if (error) {
                    console.log("Error: " + error);
                } else if (response.statusCode === 200) {
                    var $ = cheerio.load(body);
                    $('.itg .gl1t').each(function() {
                        link_array.push({
                            name: $('a .glname', this).text(),
                            link: $('a', this).attr('href'),
                            pic: $('img', this).attr('src')
                        })
                    });
                    if (link_array.length < 1) {
                        Bot.createMessage(m.channel.id, "No results found :(");
                        return;
                    }
                    const maths = Math.floor(Math.random() * link_array.length)
                    var number = maths + 1
                    var pairs = link_array[maths]
                    var $ = cheerio.load(body);
                    var exOnly = false
                    var newPage = pairs.link.replace('exhentai', 'e-hentai')
                    request({ url: newPage }, (error, response, body) => {
                        if (response.statusCode != 200) {
                            exOnly = true
                        }
                        if (response.statusCode == 200) {
                            var $$ = cheerio.load(body);
                            if ($$('.d').text().toLowerCase().includes("this gallery has been removed or is unavailable.")) {
                                exOnly = true
                            }
                        }
                        if (exOnly == true) {
                            var data = {
                                "content": "Results on for **" + search + "**",
                                "embed": {
                                    "color": 0xA260F6,
                                    "footer": {
                                        "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
                                        "text": "Searched by: " + name + ". Result " + number + " of " + link_array.length
                                    },
                                    "image": {
                                        "url": pairs.pic.replace('exhentai', 'ehgt')
                                    },
                                    "author": {
                                        "name": pairs.name
                                    },
                                    "fields": [
                                        {
                                            "name": "Exhentai:",
                                            "value": `[Link](${pairs.link})`,
                                            "inline": true
                                        },
                                        {
                                            "name": "E-hentai:",
                                            "value": `N/A (sad panda only)`,
                                            "inline": true
                                        }
                                    ]
                                }
                            };
                        }
                        if (exOnly == false) {
                            var data = {
                                "content": "Results on for **" + search + "**",
                                "embed": {
                                    "color": 0xA260F6,
                                    "footer": {
                                        "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
                                        "text": "Searched by: " + name + ". Result " + number + " of " + link_array.length
                                    },
                                    "image": {
                                        "url": pairs.pic.replace('exhentai', 'ehgt')
                                    },
                                    "author": {
                                        "name": pairs.name
                                    },
                                    "fields": [
                                        {
                                            "name": "Exhentai:",
                                            "value": `[Link](${pairs.link})`,
                                            "inline": true
                                        },
                                        {
                                            "name": "E-hentai:",
                                            "value": `[Link](${pairs.link.replace('exhentai', 'e-hentai')})`,
                                            "inline": true
                                        }
                                    ]
                                }
                            };
                        }
                        Bot.createMessage(m.channel.id, data);
                    });
                }
            });
        });
    },
    help: "Search Exhentai"
};
