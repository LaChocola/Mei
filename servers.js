"use strict";

const dbmanager = require("./dbmanager");

const dbname = "servers";

/*
    Guild Data
    data = [
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
    ]
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
