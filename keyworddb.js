"use strict";

const dbmanager = require("./dbmanager");
const ids = require("./ids");

const dbname = "keywords";

var keywords;

function get() {
    return keywords;
}

async function load() {
    keywords = await dbmanager.load(dbname);
    // Fill in an empty file with default structure
    if (!keywords.checksum) {
        keywords.checksum = ids.users.chocola;
    }
    if (!keywords) {
        keywords = {};
    }
    return keywords;
}

async function save(keywords) {
    return await dbmanager.save(dbname, keywords);
}

module.exports = {
    get,
    load,
    save
};
