"use strict";

const fs = require("fs");
const path = require("path");

const Eris = require("eris");
const glob = require("glob");
const reload = require("require-reload")(require);

const conf = require("../conf");

var lastModified = {};

function getPath(name) {
    return path.join(__dirname, name + ".js");
}

function hasChanged(name) {
    var mtime = fs.statSync(getPath(name)).mtimeMs;
    var changed = lastModified[name] && mtime !== lastModified[name];
    lastModified[name] = mtime;
    return changed;
}

function logCommand(label, m, args, success) {
    var loghead = "CMD".black;
    loghead = success ? loghead.bgGreen : loghead.bgRed;
    var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
    var logserver = `${m.channel.guild.name}`.cyan.bold || "Direct Message".cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logcmd = `${m.prefix}${label}`.bold;
    logcmd = success ? logcmd.blue : logcmd.red;
    console.log(`${loghead} ${loguser} ${">".blue.bold} ${logserver} ${"-".blue.bold} ${logchannel} ${logcmd}`);
    if (args) {
        var logargs = `${args.join(" ")}`.bold;
        logargs = success ? logargs.blue : logargs.red;
        console.log("ARG".black.bgCyan + " " + logargs);
    }
}

function LegacyCommand(label, legacy) {
    function generator(m, args) {
        var legacyArgs = args.join(" ").replace(/\[\?\]/ig, "");
        legacy.main(m.bot, m, legacyArgs, m.prefix);
    }

    var options = {
        description: legacy.help,
        hidden: legacy.hidden
    };

    return new Eris.Command(label, generator, options);
}

// This is normally done by the CommandClient
function parseArgs(m) {
    var fullArgs = m.content.replace(/<@!/g, "<@").substring(m.prefix.length).trim(); // Remove prefix
    var args = fullArgs.split(/\s+/g); // split into args
    var label = args.shift(); // Remove command label from args
    fullArgs = fullArgs.substring(m.prefix.length + label.length).trim();   // remove command label from fullargs
    m.fullArgs = fullArgs;
    return args;
}

function list() {
    var searchPath = path.join(__dirname, "*.js");
    return glob.sync(searchPath, { ignore: ["**/index.js"] })
        .map(f => path.parse(f).name);
}

function load(label) {
    var changed = hasChanged(label);
    if (conf.autoReload && changed) {
        return this.reload(label);
    }
    var command = require(getPath(label));
    if (!(command instanceof Eris.Command)) {
        command = new LegacyCommand(label, command);
    }
    return command;
}

function reload(label) {
    var command = reload(getPath(label));
    command.label = label;
    return command;
}

async function run(label, m) {
    m.command = this.load(label);
    var args = parseArgs(m);
    logCommand(label, m, args, true);
    try {
        var resp = await m.command.process(args, m);
        if (resp != null && !(resp instanceof Eris.Message)) {
            await m.reply(resp);
        }
    }
    catch (err) {
        console.err(err);
        m.reply("An error has occured.");
        logCommand(label, m, args, false);
    }
}

module.exports = {
    list,
    load,
    reload,
    run
};
