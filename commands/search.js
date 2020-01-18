"use strict";

const request = require("request-promise");
const cheerio = require("cheerio");
const querystring = require("querystring");

const config = require("../etc/config.json");

async function searchGoogleApi(args) {
    var key = config.tokens.google;
    var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=013652921652433515166:cnlmax0k6mu&q=" + encodeURI(args);
    try {
        var body = await request({
            url: url,
            simple: true
        });
    }
    catch (err) {
        console.log(err);
        throw "Google API search failed";
    }

    var jBody = JSON.parse(body);

    if (!(jBody && jBody.items[0])) {
        return;
    }

    return JSON.parse(body).items[0].link;
}

async function searchGoogleScraper(args) {
    var body = await request({
        url: "https://www.google.com/search?safe=off&q=" + encodeURI(args),
        simple: true
    });

    // It looks like google is obfuscating the classes to prevent scraping
    var $ = cheerio.load(body);
    try {
        var href = $(".r").first().find("a").first().attr("href");
        if (!href) {
            return;
        }

        var result = Object.keys(querystring.parse(href.substr(7, href.length)))[0];
        if (result === "?q") {
            return;
        }

        return result;
    }
    catch (err) {
        console.error("This should be caught here. What exactly is this catching?");
        console.error(err);
        return;
    }
}

module.exports = {
    main: async function (Bot, m, args, prefix) {
        args = m.cleanContent.replace(`${prefix}search `, "").trim();
        var message = await Bot.createMessage(m.channel.id, "`Searching...`");

        try {
            try {
                var result = await searchGoogleApi(args);
            }
            catch (err) {
                console.log(err);
                if (err !== "Google API search failed") {
                    throw err;
                }
                console.log("Falling back on HTML scraper...");
                result = await searchGoogleScraper(args);
            }
        }
        catch (err) {
            if (err.response) {
                console.error("STATUS:", err.response.statusCode, "BODY:", err.response.body);
            }
            else {
                console.log(err);
            }
            message.edit("Something went wrong");
            return;
        }

        if (!result) {
            message.edit("`No results found`");
            return;
        }

        message.edit(result);
    },
    help: "Google Stuff" // add description
};
