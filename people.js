const fs = require("fs");

module.exports = {
    load: function() {
        return JSON.parse(fs.readFileSync("./db/people.json"));
    },
    save: function(data) {
        fs.writeFileSync("./db/people.json", JSON.stringify(data, null, "\t"));
    }
}