"use strict";

const fs = require("fs").promises;

module.exports = {
    load: function () {
        var data = await fs.readFile("./db/servers.json", "utf8");
        if (data.includes("161027274764713984")) {
            try {
                return JSON.parse(await fs.readFile("./db/servers.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(await fs.readFile("/home/badmin/backup/Mei/db/servers.json"));
                await fs.writeFile("/home/badmin/Bots/Mei/db/servers.json", JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(await fs.readFile("/home/badmin/Bots/Mei/db/servers.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: function (data) {
        await fs.writeFile("./db/servers.json", JSON.stringify(data, null, "\t"));
    }
};
