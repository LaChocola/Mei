"use strict";

const fs = require("fs").promises;

const lockfile = require("proper-lockfile");

const ids = require("./ids");
const dbprefix = "./db/";
const backupprefix = "../../backup/Mei/db/";

function getdbpath(dbname) {
    return `${dbprefix}${dbname}.json`;
}

function getbackuppath(dbname) {
    return `${backupprefix}${dbname}.json`;
}

// Try loading a file from a path. Return undefined on failure.
async function loadFrom(path) {
    var data = undefined;
    try {
        var rawdata = await fs.readFile(path, "utf8");
        if (!rawdata.includes(ids.users.chocola)) {
            throw "db does not include chocola id";
        }
        data = JSON.parse(rawdata);
    }
    catch (err) {
        console.error(`Error loading ${path}: ${err}`);
    }
    return data;
}

// Load a db by name
async function load(dbname) {
    var dbpath = getdbpath(dbname);
    var backupath = getbackuppath(dbname);
    var data = loadFrom(dbpath);
    // If we failed to load the db, try loading and saving the backup copy
    if (!data) {
        console.log("JSON error, attempting restore");
        data = loadFrom(backupath);
        // If we successfully loaded the backup, save it
        if (data) {
            save(data);
            console.log("Restore Successful");
        }
    }
    // If we weren't able to load the data OR the backup, then throw an error
    if (!data) {
        throw "Unable to load db";
    }
    return data;
}

// Save a db by name
async function save(dbname, data) {
    var dbpath = getdbpath(dbname);
    try {
        var release = await lockfile.lock(dbpath);
        await fs.writeFile(dbpath, JSON.stringify(data, null, "\t"));
        await release();
    }
    catch (e) {
        console.error(e);
    }
}

module.exports = {
    load,
    save
};