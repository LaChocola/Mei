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
    function generator(args, m) {
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
    var args = m.content.replace(/<@!/g, "<@").substring(m.prefix.length).trim().split(/\s+/g); // Remove prefix and split into args
    args.shift(); // Remove command label from args
    return args;
}

module.exports = {
    list: function() {
        var searchPath = path.join(__dirname, "*.js");
        return glob.sync(searchPath, { ignore: ["**/index.js"] })
            .map(f => path.parse(f).name);
    },
    load: function(label) {
        var changed = hasChanged(label);
        if (conf.autoReload && changed) {
            return this.reload(label);
        }
        var command = require(getPath(label));
        if (!(command instanceof Eris.Command)) {
            command = new LegacyCommand(label, command);
        }
        return command;
    },
    reload: function(label) {
        var command = reload(getPath(label));
        command.label = label;
        return command;
    },
    run: function(label, m) {
        m.command = this.load(label);
        var args = parseArgs(m);
        logCommand(label, m, args, true);
        try {
            m.command.process(args, m);
        }
        catch (err) {
            console.log(err);
            m.reply("An error has occured.");
            logCommand(label, m, args, false);
        }
    }
};
