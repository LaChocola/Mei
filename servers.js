const fs = require("fs");

module.exports = {
    load: function() {
        return JSON.parse(fs.readFileSync("./db/servers.json"));
    },
    save: function(data) {
        fs.writeFileSync("./db/servers.json", JSON.stringify(data, null, "\t"));
    }
}
