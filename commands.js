"use strict";

const fs = require("fs");
const path = require("path");

const reload = require("require-reload")(require);

var commands = {};

class CommandsError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandsError";
    }
}

class UnknownCommandError extends CommandsError {
    constructor(message) {
        super(message);
        this.name = "UnknownCommandError";
    }
}

class CommandNotLoadedError extends CommandsError {
    constructor(message) {
        super(message);
        this.name = "CommandNotLoadedError";
    }
}

class CommandAlreadyLoadedError extends CommandsError {
    constructor(message) {
        super(message);
        this.name = "CommandAlreadyLoadedError";
    }
}

function getCommandPath(name) {
    return path.join(__dirname, "commands", name);
}

function getAvailableCommands() {
    const files = fs.readdirSync(path.join(__dirname, "commands"));
    return files.map(file => path.basename(file, ".js"));
}

function loadAllCommands() {
    getAvailableCommands().forEach(function(name) {
        name = name.toLowerCase();
        loadCommand(name);
    });
}

function loadCommand(name) {
    name = name.toLowerCase();
    if (commands[name]) {
        throw new CommandAlreadyLoadedError(`${name} is already loaded`);
    }

    try {
        commands[name] = reload(getCommandPath(name));
    }
    catch (err) {
        if (err.code === "MODULE_NOT_FOUND") {
            throw new UnknownCommandError(`${name} is an unknown command`);
        }
        throw err;
    }
}

function unloadCommand(name) {
    name = name.toLowerCase();
    if (!commands[name]) {
        throw new CommandNotLoadedError(`${name} is not loaded`);
    }

    delete commands[name];
}

function reloadCommand(name) {
    name = name.toLowerCase();
    unloadCommand(name);
    loadCommand(name);
}

function disableCommand(name) {
    name = name.toLowerCase();
    var command = commands[name];
    if (!command) {
        throw new CommandNotLoadedError(`${name} is not loaded`);
    }

    command.disable = true;
}

function enableCommand(name) {
    name = name.toLowerCase();
    var command = commands[name];
    if (!command) {
        throw new CommandNotLoadedError(`${name} is not loaded`);
    }

    command.disable = false;
}

module.exports = {
    loadAll: loadAllCommands,
    load: loadCommand,
    unload: unloadCommand,
    reload: reloadCommand,
    disable: disableCommand,
    enable: enableCommand,
    commands: commands,
    CommandNotLoadedError: CommandNotLoadedError,
    CommandAlreadyLoadedError: CommandAlreadyLoadedError,
    UnknownCommandError: UnknownCommandError,
    CommandsError: CommandsError
};
