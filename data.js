const fs = require("fs");

module.exports = {
    load: function() {
        return JSON.parse(fs.readFileSync("./db/data.json"));
    },
    save: function(data) {
        fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));
    }
}