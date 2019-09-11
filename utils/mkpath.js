"use strict";

const util = require("util");
const fs = require("fs");
const path = require("path");

const fsPromises = {
    mkdir: util.promisify(fs.mkdir)
};

// Create parent directories if they don't already exist
async function mkpath(filepath) {
    try {
        await fsPromises.mkdir(path.dirname(filepath), { recursive: true });
    }
    catch (err) {
        if (err.code === "EEXIST") {    // Ignore "directory already exists" errors
            return;
        }
        throw err;
    }
}

module.exports = mkpath;
