"use strict";

const util = require("util");
const fs = require("fs");

const fsPromises = {
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile)
};

const conf = require("../conf");
const utils = require("../utils");

// Tries to parse file data. On error, returns undefined.
function parse(fileData) {
    var data;

    if (!fileData) {
        return data;
    }

    // file must include chocola's id to be considered valid
    if (!fileData.includes(conf.users.chocola)) {
        return data;
    }

    try {
        data = JSON.parse(fileData);
    }
    catch (err) {
        console.error(err);
    }

    return data;
}

// Tries to load a file. On error, returns undefined.
async function loadfile(path) {

    try {
        var fileData = await fsPromises.readFile(path, "utf8");
    }
    catch (err) {
        // TODO: If file is missing, create a new blank file. Maybe load from template?
        if (err.code === "ENOENT") {
            console.error("DB file not found: " + path);
        }
        else {
            console.error(err);
        }
    }

    return parse(fileData);
}

class DataManager {
    constructor(dataPath, backupPath, filterData) {
        this.dataPath = dataPath;
        this.backupPath = backupPath;
        this.filterData = filterData || (data => data);
    }

    // Loads a database file
    // Tries to restore from backup if data file is corrupt
    // Throws an error if unable to load from either data file or backup file
    async load() {
        var self = this;

        var data = await loadfile(self.dataPath);

        if (!data) {
            console.log("db JSON error, attempting restore");
            data = await loadfile(self.backupPath);

            if (data) {
                console.log("Restore Successful");
            }
            else {
                console.warn("Unable to load backup file. Defaulting to empty db instead.");
                data = {
                    "checkValue": conf.users.chocola
                };
            }

            await self.save(data);
        }

        return self.filterData(data);
    }

    async save(data) {
        var self = this;

        try {
            await utils.mkpath(self.dataPath);
            await fsPromises.writeFile(self.dataPath, JSON.stringify(data, null, "\t"));
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = DataManager;
