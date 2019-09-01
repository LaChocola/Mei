"use strict";

const glob = require("glob");
const path = require("path");

glob.sync(path.join(__dirname, "*.js"), { ignore: ["**/index.js"] }).forEach(function(file) {
    var name = path.parse(file).name;
    module.exports[name] = require(path.resolve(file));
});
