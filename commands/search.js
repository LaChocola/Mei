"use strict";

const request = require("request");
const cheerio = require("cheerio");
const querystring = require("querystring");

const conf = require("../conf");

var enabled = Boolean(conf.tokens.google);

if (!enabled) {
    console.warn("Google token not found. Disabling search command.");
}

function fallbackHTMLScraper(args, safe, message) {
    console.log("Falling back on HTML scraper...");

    request("https://www.google.com/search?safe=" + safe + "&q=" + encodeURI(args), function(err, res, body) {
        if (res.statusCode !== 200) {
            console.error("STATUS:", res.statusCode, "BODY:", body);
            message.edit("`No results found!`");
            return;
        }
        else {
            var $ = cheerio.load(body);
            try {
                var href = $(".r").first().find("a").first().attr("href");
                if (!href) {
                    message.edit("`No results found`");
                    return;
                }
                res = Object.keys(querystring.parse(href.substr(7, href.length)))[0];
                if (res === "?q") {
                    message.edit("`No results found`");
                    return;
                }
                else {
                    message.edit(res);
                }
            }
            catch (err) {
                console.error(err);
                message.edit("`No results found`");
                return;
            }
        }
    });

}

module.exports = {
    main: async function(bot, m, args, prefix) {
        if (!enabled) {
            return;
        }
        args = m.cleanContent.replace(`${prefix}search `, "").trim();
        m.reply("`Searching...`").then(function(message) {
            var safe = "off";
            var key = conf.tokens.google;
            var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=013652921652433515166:cnlmax0k6mu&q=" + encodeURI(args);
            try {
                request(url, function(error, response, body) {

                    try {
                        var jBody = JSON.parse(body);
                        if (!jBody) {
                            message.edit("`No results found`");
                            return;
                        }
                        if (jBody["items"][0]) {
                            message.edit(JSON.parse(body)["items"][0]["link"]);
                        }
                        else if (!message.edit(JSON.parse(body)["items"][0]["link"])) {
                            fallbackHTMLScraper(args, safe, message);
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
            }
            catch (err) {
                console.log(err);
                message.edit("`No results found`");
                return;
            }
        });
    },
    help: "Google Stuff", // add description
    hidden: !enabled
};
