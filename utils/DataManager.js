"use strict";

const fs = require("fs");

const conf = require("../conf");

// Returns parsed data. On error, returns undefined.
function parse(fileData) {
    var data = undefined;

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

class DataManager {
    constructor(dataPath, backupPath) {
        this.dataPath = dataPath;
        this.backupPath = backupPath;
    }

    loadBackup() {
        var self = this;

        var fileData = fs.readFileSync(self.backupPath, "utf8");
        var data = parse(fileData);

        return data;
    }

    load() {
        var self = this;

        // TODO: If file is missing, create a new blank file. Maybe load from template?
        var fileData = fs.readFileSync(self.dataPath, "utf8");
        var data = parse(fileData);

        if (!data) {
            console.log("JSON error, attempting restore");
            data = self.loadBackup();

            if (data) {
                self.save(data);
                console.log("Restore Successful");
            }
            else {
                console.error("Unable to load backup file");
            }
        }

        return data;
    }

    save(data) {
        var self = this;

        fs.writeFileSync(self.dataPath, JSON.stringify(data, null, "\t"));
    }
}

module.exports = DataManager;
