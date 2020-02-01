"use strict";

const dbmanager = require("./dbmanager");

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
    return await dbmanager.load(dbname);
}

async function save(data) {
    return await dbmanager.save(dbname, data);
}

module.exports = {
    load,
    save
};
