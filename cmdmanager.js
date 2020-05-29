"use strict";

const path = require("path");
const fs = require("fs");

const reload = require("require-reload")(require);

const datadb = require("./data");

var commands = new Map();

// Check if command is enabled
async function isEnabled(name, data) {
    if (!commands.has(name)) {
        return false;
    }
    var enabled = data.commands[name].enabled;
    if (enabled === undefined) {
        enabled = true;
    }
    return enabled;
}

// Disable a command
async function disableCommand(name, data) {
    if (!commands.has(name)) {
        return;
    }
    data.commands[name].enabled = false;
    await datadb.save(data);
}

// Enable a command
async function enableCommand(name, data) {
    if (!commands.has(name)) {
        return;
    }
    data.commands[name].enabled = true;
    await datadb.save(data);
}

// Get a loaded command
function getCommand(name) {
    return commands.get(name);
}

// Get a loaded command
function getAllCommands() {
    return Array.from(commands.values());
}

// Check if a command is loaded
function hasCommand(name) {
    return commands.has(name);
}

// List all loaded commands
function listCommands() {
    return Array.from(commands.keys());
}

// Load all the commands when the bot first starts up
function loadAllCommands() {
    var modules = listCommandModules();
    commands.clear();
    for (let name of modules) {
        loadCommand(name);
    }
}

// Load a command
function loadCommand(name) {
    if (commands.has(name)) {
        return;
    }
    var cmd = loadCommandModule(name);
    commands.set(name, cmd);
}

// Unload a command
function unloadCommand(name) {
    return commands.delete(name);
}

// Reload a command
function reloadCommand(name) {
    commands.delete(name);
    var cmd = reloadCommandModule(name);
    commands.set(name, cmd);
}

// Reload a command
function reloadAllCommands() {
    var modules = listCommandModules();
    commands.clear();
    for (let name of modules) {
        reloadCommand(name);
    }
}

// Get a list of all command modules available to load
function listCommandModules() {
    var commands = fs.readdirSync(path.join(__dirname, "commands"));
    commands = commands.filter(c => c.endsWith(".js"));         // Only list js files
    commands = commands.filter(c => !c.endsWith(".test.js"));   // Ignore jest files
    commands = commands.map(c => path.parse(c).name);           // Remove the extension
    return commands;
}

// Load a command from module
function loadCommandModule(name) {
    var filename = name + ".js";
    var cmdpath = path.join(__dirname, "commands", filename);
    try {
        var cmd = require(cmdpath);
    }
    catch(err) {
        // log errors then rethrow them
        console.error(`Failed to load command '${name}'`, err);
        throw err;
    }
    cmd.name = name;
    return cmd;
}

// Reload a command from module
function reloadCommandModule(name) {
    var filename = name + ".js";
    var cmdpath = path.join(__dirname, "commands", filename);
    try {
        var cmd = reload(cmdpath);
    }
    catch(err) {
        // log errors then rethrow them
        console.error(`Failed to reload command '${name}'`, err);
        throw err;
    }
    cmd.name = name;
    return cmd;
}

module.exports = {
    isEnabled: isEnabled,
    enable: enableCommand,
    disable: disableCommand,
    get: getCommand,
    getAll: getAllCommands,
    has: hasCommand,
    list: listCommands,
    loadAll: loadAllCommands,
    load: loadCommand,
    unload: unloadCommand,
    reload: reloadCommand,
    reloadAll: reloadAllCommands
};
