"use strict";

const dbmanager = require("./dbmanager");
const ids = require("./ids");

const dbname = "servers";

/*
    Guild Data
    data = {
        "[guildid]": {
            "name": "[guild name]",
            "owner": "[guild ownerID]",
            "art": "[art channelid]",
            "mods": {
                "[mod userid]": true
            },
            "modRoles": [
                "[mod roleid]": true
            ],
            "hoards: true/false,
            "notifications": {
                "banlog": "[banlog channelid]",
                "updates": "[updates channelid]",
                "welcome": {
                    "[welcome channelid]": "[message]"
                },
                "leave": {
                    "[leave channelid]": "[message]"
                }
            },
            "prefix": "[guild command prefix]",
            "adds": true/false/milliseconds,
            "roles": {
                "[rolename]": "[roleid]"
            },
            "giveaways": {
                "running": true/false,
                "item": "[giveaway item description]",
                "current": {
                    "contestants": {
                        {
                            "[contestant userid]": "entered"
                        }
                    }
                },
                "creator": "[creator userid]",
                "mID": "[giveaway message id]",
                "channelID": "[giveaway channel id]"
            },
            "music": {
                "queue": {
                    "[youtube video id]": "[requester name]"
                },
                "current": {
                    "code": "[youtube video id]",
                    "player": "[requester name]"
                }
            },
            "game": {
                "channel": "[channel id]",
                "player": "[player id]",
                "active": true/false,
                "choices": ["[choice]"]
            }
        }
    }
 */

async function load() {
    var guildsdata = await dbmanager.load(dbname);
    // Fill in an empty file with default structure
    if (!guildsdata.checksum) {
        guildsdata.checksum = ids.users.chocola;
    }
    return guildsdata;
}

async function save(guildsdata) {
    return await dbmanager.save(dbname, guildsdata);
}

module.exports = {
    load,
    save
};
