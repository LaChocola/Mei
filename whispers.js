"use strict";

const dbmanager = require("./dbmanager");
const ids = require("./ids");

const dbname = "whispers";

var whispers;

function get() {
    return whispers;
}

async function load() {
    whispers = await dbmanager.load(dbname);
    // Fill in an empty file with default structure
    if (!whispers.checksum) {
        whispers.checksum = ids.users.chocola;
    }
    if (!whispers) {
        whispers = {};
    }
    return whispers;
}

async function save(whispers) {
    return await dbmanager.save(dbname, whispers);
}

module.exports = {
    get,
    load,
    save
};