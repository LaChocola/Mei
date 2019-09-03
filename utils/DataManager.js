"use strict";

const fs = require("fs").promises;

const conf = require("../conf");

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
    var fileData = await fs.readFile(path, "utf8")
        .catch(function(err) {
            // TODO: If file is missing, create a new blank file. Maybe load from template?
            if (err.code === "ENOENT") {
                console.error("DB file not found: " + path);
            }
            else {
                console.error(err);
            }
        });

    return parse(fileData);
}

class DataManager {
    constructor(dataPath, backupPath) {
        this.dataPath = dataPath;
        this.backupPath = backupPath;
    }

    async load() {
        var self = this;

        var data = await loadfile(self.dataPath);
        
        if (!data) {
            console.log("JSON error, attempting restore");
            data = await loadfile(self.backupPath);

            if (data) {
                await self.save(data);
                console.log("Restore Successful");
            }
            else {
                console.error("Unable to load backup file");
            }
        }

        return data;
    }

    async save(data) {
        var self = this;

        await fs.writeFile(self.dataPath, JSON.stringify(data, null, "\t"));
    }
}

module.exports = DataManager;
