"use strict";

const path = require("path");

function getPkgPath(resourcePath) {
    return path.join(__dirname, "..", resourcePath);
}

module.exports = getPkgPath;
