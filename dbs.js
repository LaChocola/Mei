"use strict";

const DataManager = require("./utils/DataManager");

var globalDataPath = "./db/data.json";      // Relative to current working directory
var globalBackupPath = "/home/badmin/backup/Mei/db/data.json";
var guildDataPath = "./db/servers.json";    // Relative to current working directory
var guildBackupPath = "/home/badmin/backup/Mei/db/servers.json";
var userDataPath = "./db/people.json";      // Relative to current working directory
var userBackupPath = "/home/badmin/backup/Mei/db/people.json";

module.exports = {
    global: new DataManager(globalDataPath, globalBackupPath),
    guild: new DataManager(guildDataPath, guildBackupPath),
    user: new DataManager(userDataPath, userBackupPath)
};
