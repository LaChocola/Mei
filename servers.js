"use strict";

const fs = require("fs");

var dataPath = "./db/servers.json";
var backupPath = "/home/badmin/backup/Mei/db/servers.json";
var chocolaId = "161027274764713984";

module.exports = {
    load: function() {
        var data = fs.readFileSync(dataPath, "utf8");
        if (data.includes(chocolaId)) {
            try {
                return JSON.parse(fs.readFileSync(dataPath));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(fs.readFileSync(backupPath));
                fs.writeFileSync(dataPath, JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(fs.readFileSync(dataPath));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: function(data) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, "\t"));
    }
};
