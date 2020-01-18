"use strict";

const qs = require("querystring");
const request = require("request-promise").defaults({ jar: true });
const cheerio = require("cheerio");

const config = require("../etc/config.json");
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

async function checkehentai(pairs) {
    var exhentaiUrl = pairs.link.replace("exhentai", "e-hentai");

    var link = `[Link](${exhentaiUrl})`;

    try {
        var body = await request({ url: exhentaiUrl, simple: true });
        var $$ = cheerio.load(body);
        if ($$(".d").text().toLowerCase().includes("this gallery has been removed or is unavailable.")) {
            link = "N/A (sad panda only)";
        }
    }
    catch (err) {
        link = "N/A (sad panda only)";
    }

    return link;
}

module.exports = {
    main: async function (Bot, m, args, prefix) {

        if (!m.channel.nsfw) {
            Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
            return;
        }
        var name = m.author.nick || m.author.username;
        args = m.cleanContent.replace(`${prefix}ex`, "").replace(`${prefix}ex `, "").toLowerCase().split(", ");
        var search = args.join(" ");
        if (!search) {
            search = "giantess";
        }
        var q = qs.encode(Object.assign({
            f_search: search
        }, defaultQuery));
        var pageToVisit = `https://exhentai.org/?${q}`;
        var cookie1 = request.cookie(config.tokens.exhentai.id);
        var cookie2 = request.cookie(config.tokens.exhentai.hash);
        var cookie3 = request.cookie("sl=dm_1");
        const j = request.jar();
        j.setCookie(cookie1, pageToVisit);
        j.setCookie(cookie2, pageToVisit);
        j.setCookie(cookie3, pageToVisit);
        await Bot.sendChannelTyping(m.channel.id);

        try {
            var body = request({
                url: pageToVisit,
                jar: j,
                simple: true
            });
        }
        catch (err) {
            console.log("Error: " + err);
            return;
        }

        var link_array = [];
        var $;
        $ = cheerio.load(body);
        $(".itg .gl1t").each(function () {
            link_array.push({
                name: $("a .glname", this).text(),
                link: $("a", this).attr("href"),
                pic: $("img", this).attr("src")
            });
        });

        if (link_array.length < 1) {
            Bot.createMessage(m.channel.id, "No results found :(");
            return;
        }

        const index = Math.floor(Math.random() * link_array.length);
        var number = index + 1;
        var pairs = link_array[index];
        $ = cheerio.load(body);

        var e_hentai = checkehentai(pairs);

        Bot.createMessage(m.channel.id, {
            content: "Results on Exhentai for **" + search + "**",
            embed: {
                color: 0xA260F6,
                footer: {
                    icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
                    text: "Searched by: " + name + ". Result " + number + " of " + link_array.length
                },
                image: {
                    url: pairs.pic.replace("exhentai", "ehgt")
                },
                author: {
                    name: pairs.name
                },
                fields: [
                    {
                        name: "Exhentai:",
                        value: `[Link](${pairs.link})`,
                        inline: true
                    },
                    {
                        name: "E-hentai:",
                        value: e_hentai,
                        inline: true
                    }
                ]
            }
        });
    },
    help: "Search Exhentai"
};
