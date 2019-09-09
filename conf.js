"use strict";

// This file loads the bot configuration from environment variables, a .env file, and ./etc/config.json in that order. If no options are set, it tries to provide reasonable defaults.

const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand(dotenv.config());

var legacyConfig;
try {
    legacyConfig = require("./etc/config.json");
}
catch (err) {
    legacyConfig = {
        tokens: {
            exhentai: {}
        }
    };
}

var conf = {};
conf.prefix = process.env.MEI_PREFIX || legacyConfig.prefix || "!";
conf.autoReload = process.env.MEI_AUTORELOAD === "true";
conf.tokens = {
    mei: process.env.MEI_TOKEN_MEI || legacyConfig.tokens.mei,
    other: process.env.MEI_TOKEN_OTHER || legacyConfig.tokens.other,
    sauce: process.env.MEI_TOKEN_SAUCE || legacyConfig.tokens.sauce,
    webster: process.env.MEI_TOKEN_WEBSTER || legacyConfig.tokens.webster,
    apiai: process.env.MEI_TOKEN_APIAI || legacyConfig.tokens.apiai,
    exhentai: {
        id: process.env.MEI_TOKEN_EXHENTAI_ID || legacyConfig.tokens.exhentai.id,
        hash: process.env.MEI_TOKEN_EXHENTAI_HASH || legacyConfig.tokens.exhentai.hash
    },
    google: process.env.MEI_TOKEN_GOOGLE || legacyConfig.tokens.google,
    youtube: process.env.MEI_TOKEN_YOUTUBE || legacyConfig.tokens.youtube
};

conf.users = {
    chocola: "161027274764713984",
    natalie: "137269976255037440",
    digiduncan: "271803699095928832",
    catclancer: "143906582235840512",
    whosthis: "187368906493526017",
    arachne: "444791634966740993",  // TODO: Auto-ignore bot users
    dyno: "155149108183695360",     // TODO: Auto-ignore bot users
    mei: "309220487957839872"
};
conf.users.owner = process.env.MEI_OWNER || conf.users.chocola;
conf.users.bot = process.env.MEI_BOT || conf.users.mei; // TODO: REPLACE EVERYWHERE WITH `bot.user.id`

conf.guilds = {
    guild1: "187694240585744384",
    guild2: "196027622944145408",
    krumblys_ant_farm: "261599167695159298",    // Krumbly's ant farm
    r_macrophilia: "373589430448947200",        // r/Macrophilia
    giantess_archive: "420402860027805696",     // Giantess Archive
    the_big_house: "319534510318551041",        // The Big House
    small_world: "354709664509853708",          // Small World
    the_giantess_club: "345390985150201859"     // The Giantess Club
};

conf.roles = {
    role1: "375633311449481218",
    role2: "363854631035469825"
};

conf.channels = {
    channel1: "446548104704032768"
};

conf.emojis = {
    giveaway: "367892951780818946"
};

module.exports = conf;
