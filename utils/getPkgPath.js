"use strict";

function getPkgPath(path) {
    return path.join(__dirname, "..", path);
}

module.exports = getPkgPath;
