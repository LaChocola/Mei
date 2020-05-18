"use strict";

const dbmanager = require("./dbmanager");
const ids = require("./ids");

const dbname = "data";

/*
    Global Data
    data = {
        "banned": {
            "global": {
                "[userid]": "[reason message]"
            }
        },
        "commands": {
            "[command name]": {
                "totalUses": 0,
                "users": {
                    "[userid]": 0
                }
            },
            "totalRuns": 0
        }
    }
 */

async function load() {
    var data = await dbmanager.load(dbname);
    // Fill in an empty file with default structure
    if (!data.checksum) {
        data.checksum = ids.users.chocola;
    }
    if (!data.banned) {
        data.banned = {};
    }
    if (!data.banned.global) {
        data.banned.global = {};
    }
    if (!data.commands) {
        data.commands = {};
    }
    if (!data.commands.totalRuns) {
        data.commands.totalRuns = 0;
    }
    return data;
}

async function save(data) {
    return await dbmanager.save(dbname, data);
}

module.exports = {
    load,
    save
};
