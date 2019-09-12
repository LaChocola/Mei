"use strict";

const DataManager = require("./utils/DataManager");

var globalDataPath = "./db/data.json";      // Relative to current working directory
var globalBackupPath = "/home/badmin/backup/Mei/db/data.json";
var guildDataPath = "./db/servers.json";    // Relative to current working directory
var guildBackupPath = "/home/badmin/backup/Mei/db/servers.json";
var userDataPath = "./db/people.json";      // Relative to current working directory
var userBackupPath = "/home/badmin/backup/Mei/db/people.json";

module.exports = {
    global: new DataManager(globalDataPath, globalBackupPath,
        function(globalData) {
            // Reasonable defaults
            if (!globalData.commands) {
                globalData.commands = {};
            }
            if (!globalData.commands.totalRuns) {
                globalData.commands.totalRuns = 0;
            }
            if (!globalData.banned) {
                globalData.banned = {};
            }
            if (!globalData.banned.global) {
                globalData.banned.global = {};
            }
            return globalData;
        }),
    guild: new DataManager(guildDataPath, guildBackupPath,
        function(guildDbs) {
            // Reasonable defaults
            return guildDbs;
        }),
    user: new DataManager(userDataPath, userBackupPath,
        function(userDbs) {
            if (!userDbs.people) {
                userDbs.people = {};
            }
            // Reasonable defaults
            return userDbs;
        })
};
