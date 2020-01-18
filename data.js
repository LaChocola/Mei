"use strict";

const fs = require("fs").promises;
const ids = require("./ids");

module.exports = {
    load: async function () {
        var data = await fs.readFile("./db/data.json", "utf8");
        if (data.includes(ids.users.chocola)) {
            try {
                return JSON.parse(await fs.readFile("./db/data.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(await fs.readFile("/home/badmin/backup/Mei/db/data.json"));
                await fs.writeFile("/home/badmin/Bots/Mei/db/data.json", JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(await fs.readFile("/home/badmin/Bots/Mei/db/data.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: async function (data) {
        await fs.writeFile("./db/data.json", JSON.stringify(data, null, "\t"));
    }
};
