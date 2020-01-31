"use strict";

const qs = require("querystring");

const request = require("request-promise").defaults({
    jar: true
});
const cheerio = require("cheerio");

const conf = require("../conf");

class SiteUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = "SiteUnavailableError";
    }
}

const defaultQuery = {
    f_doujinshi: 0,
    f_manga: 0,
    f_artistcg: 0,
    f_gamecg: 0,
    f_western: 0,
    "f_non-h": 0,
    f_imageset: 0,
    f_cosplay: 0,
    f_asianporn: 0,
    f_misc: 0,
    f_apply: "Apply Filter"
};

async function searchExHentai(searchString) {
    if (!searchString) {
        searchString = "giantess";
    }

    var q = qs.encode(Object.assign({
        f_search: searchString
    }, defaultQuery));

    var j = request.jar();
    var searchUrl = `https://exhentai.org/?${q}`;
    j.setCookie(request.cookie("ipb_member_id=" + conf.tokens.exhentai.id), searchUrl);
    j.setCookie(request.cookie("ipb_pass_hash=" + conf.tokens.exhentai.hash), searchUrl);
    j.setCookie(request.cookie("sl=dm_1"), searchUrl);

    //await Bot.sendChannelTyping(m.channel.id);

    try {
        var body = await request({
            url: searchUrl,
            jar: j
        });
    }
    catch(err) {
        throw new SiteUnavailableError(err);
    }

    var $ = cheerio.load(body);
    if ($(".ido").length === 0) {
        throw new SiteUnavailableError();
    }

    var results = [];
    $(".itg .gl1t").each(function() {
        results.push({
            name: $("a .glname", this).text(),
            link: $("a", this).attr("href"),
            pic: $("img", this).attr("src")
        });
    });

    return results;
}

async function checkEHentai(url) {
    try {
        var body = await request({ url: url });
    }
    catch (err) {
        return false;
    }
    var $$ = cheerio.load(body);
    if ($$(".d").text().toLowerCase().includes("this gallery has been removed or is unavailable.")) {
        return false;
    }

    return true;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (!m.channel.nsfw) {
            await Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
            return;
        }

        var cmdString = `${prefix}ex`;
        var cleanArgs = m.cleanContent.slice(cmdString.length).trim();
        var searchTerms = cleanArgs.toLowerCase().split(",").map(t => t.trim());
        var searchString = searchTerms.join(" ");

        try {
            var results = await searchExHentai(searchString);
        }
        catch(err) {
            if (err instanceof SiteUnavailableError) {
                Bot.createMessage(m.channel.id, "Cannot access sad panda 🐼");
                return;
            }
            throw err;
        }

        if (results.length === 0) {
            Bot.createMessage(m.channel.id, "No results found :(");
            return;
        }

        const index = Math.floor(Math.random() * results.length);
        var number = index + 1;
        var result = results[index];

        var exHentaiUrl = result.link;

        var eHentaiUrl = exHentaiUrl.replace("exhentai", "e-hentai");
        var hasEHentai = await checkEHentai(eHentaiUrl);

        var eHentaiLink = "N/A (sad panda only)";
        if (hasEHentai) {
            eHentaiLink = `[Link](${eHentaiUrl})`;
        }

        var name = m.author.nick || m.author.username;
        await Bot.createMessage(m.channel.id, {
            "content": "Results on Exhentai for **" + searchString + "**",
            "embed": {
                "color": 0xA260F6,
                "footer": {
                    "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
                    "text": "Searched by: " + name + ". Result " + number + " of " + results.length
                },
                "image": {
                    "url": result.pic.replace("exhentai", "ehgt")
                },
                "author": {
                    "name": result.name
                },
                "fields": [
                    {
                        "name": "Exhentai:",
                        "value": `[Link](${exHentaiUrl})`,
                        "inline": true
                    },
                    {
                        "name": "E-hentai:",
                        "value": eHentaiLink,
                        "inline": true
                    }
                ]
            }
        });
    },
    help: "Search Exhentai"
};
