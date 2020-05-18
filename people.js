"use strict";

const dbmanager = require("./dbmanager");
const ids = require("./ids");

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
    var peopledata = await dbmanager.load(dbname);
    // Fill in an empty file with default structure
    if (!peopledata.checksum) {
        peopledata.checksum = ids.users.chocola;
    }
    if (!peopledata.people) {
        peopledata.people = {};
    }
    return peopledata;
}

async function save(data) {
    return await dbmanager.save(dbname, data);
}

module.exports = {
    load,
    save
};
