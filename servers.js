"use strict";

const fs = require("fs");

module.exports = {
    load: function() {
        var data = fs.readFileSync("./db/servers.json", "utf8");
        if (data.includes("161027274764713984")) {
            try {
                return JSON.parse(fs.readFileSync("./db/servers.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(fs.readFileSync("/home/badmin/backup/Mei/db/servers.json"));
                fs.writeFileSync("/home/badmin/Bots/Mei/db/servers.json", JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(fs.readFileSync("/home/badmin/Bots/Mei/db/servers.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: function(data) {
        fs.writeFileSync("./db/servers.json", JSON.stringify(data, null, "\t"));
    }
};
