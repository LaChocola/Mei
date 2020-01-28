"use strict";

// This file loads the bot configuration from environment variables, a .env file, and ./etc/config.json in that order. If no options are set, it tries to provide reasonable defaults.
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

var legacyConfigPath = "./etc/config.json";

var conf = {
    prefix: "!",
    tokens: {
        mei: undefined,
        apiai: undefined,
        exhentai: {
            id: undefined,
            hash: undefined
        },
        sauce: undefined,
        google: undefined
    },
    // TODO: Make async
    load: function() {
        var legacyConfig;
        try {
            legacyConfig = JSON.parse(fs.readFileSync(legacyConfigPath));    // Relative to current working directory
        }
        catch (err) {
            legacyConfig = {
                tokens: {
                    exhentai: {}
                }
            };
        }

        conf.prefix = process.env.MEI_PREFIX || legacyConfig.prefix || "!";
        conf.tokens.mei = process.env.MEI_TOKEN_MEI || legacyConfig.tokens.mei;
        conf.tokens.apiai = process.env.MEI_TOKEN_APIAI || legacyConfig.tokens.apiai;
        conf.tokens.exhentai.id = process.env.MEI_TOKEN_EXHENTAI_ID || legacyConfig.tokens.exhentai.id;
        conf.tokens.exhentai.hash = process.env.MEI_TOKEN_EXHENTAI_HASH || legacyConfig.tokens.exhentai.hash;
        conf.tokens.sauce = process.env.MEI_TOKEN_SAUCE || legacyConfig.tokens.sauce;
        conf.tokens.google = process.env.MEI_TOKEN_GOOGLE || legacyConfig.tokens.google;
    }
};

module.exports = conf;
