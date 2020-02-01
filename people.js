"use strict";

const dbmanager = require("./dbmanager");

const dbname = "people";

/*
    User Data
    data = {
        "people": {
            "[user id]": {
                "links": {
                    "[link name]": "[link url]"
                },
                "fetishes": {
                    "[fetish name]": "[like/dislike]"
                },
                "hoard": {
                    "[hoard emoji]": {
                        "[hoard url/text]": "[source user id]"
                    }
                },
                "adds": 0,
                "names": {
                    "[name]": "[male/female/futa]"
                }
            }
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
