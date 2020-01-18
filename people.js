"use strict";

const fs = require("fs").promises;
const ids = require("../ids");

module.exports = {
    load: async function () {
        var data = await fs.readFile("./db/people.json", "utf8");
        if (data.includes(ids.users.chocola)) {
            try {
                return JSON.parse(await fs.readFile("./db/people.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("JSON error, attempting restore");
            try {
                var backup = JSON.parse(await fs.readFile("/home/badmin/backup/Mei/db/people.json"));
                await fs.writeFile("/home/badmin/Bots/Mei/db/people.json", JSON.stringify(backup, null, "\t"));
                console.log("Restore Successful");
                return JSON.parse(await fs.readFile("/home/badmin/Bots/Mei/db/people.json"));
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    save: async function (data) {
        await fs.writeFile("./db/people.json", JSON.stringify(data, null, "\t"));
    }
};
