"use strict";

const DataManager = require("./utils/DataManager");

var globalDataPath = "./db/data.json";
var globalBackupPath = "/home/badmin/backup/Mei/db/data.json";
var guildDataPath = "./db/servers.json";
var guildBackupPath = "/home/badmin/backup/Mei/db/servers.json";
var userDataPath = "./db/people.json";
var userBackupPath = "/home/badmin/backup/Mei/db/people.json";

module.exports = {
    global: new DataManager(globalDataPath, globalBackupPath),
    guild: new DataManager(guildDataPath, guildBackupPath),
    user: new DataManager(userDataPath, userBackupPath)
};
