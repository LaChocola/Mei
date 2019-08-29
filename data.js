"use strict";

const fs = require("fs");

module.exports = {
    load: function() {
        var data = fs.readFileSync("./db/data.json", "utf8");
        if (data.includes("161027274764713984")) {
            try {
                return JSON.parse(fs.readFileSync("./db/data.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(fs.readFileSync("/home/badmin/backup/Mei/db/data.json"));
                fs.writeFileSync("/home/badmin/Bots/Mei/db/data.json", JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(fs.readFileSync("/home/badmin/Bots/Mei/db/data.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: function(data) {
        fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));
    }
};
