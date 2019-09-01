"use strict";

const fs = require("fs");
const path = require("path");

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

function logCommand(m, prefix, command, args, success) {
    var loghead = "CMD".black;
    loghead = success ? loghead.bgGreen : loghead.bgRed;
    var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
    var logserver = `${m.channel.guild.name}`.cyan.bold || "Direct Message".cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logcmd = `${prefix}${command}`.bold;
    logcmd = success ? logcmd.blue : logcmd.red;
    console.log(`${loghead} ${loguser} ${">".blue.bold} ${logserver} ${"-".blue.bold} ${logchannel} ${logcmd}`);
    if (args) {
        var logargs = `${args}`.bold;
        logargs = success ? logargs.blue : logargs.red;
        console.log("ARG".black.bgCyan + " " + logargs);
    }
}

module.exports = {
    list: function() {
        var searchPath = path.join(__dirname, "*.js");
        return glob.sync(searchPath, { ignore: ["**/index.js"] })
            .map(f => path.parse(f).name);
    },
    load: function(name) {
        var changed = hasChanged(name);
        if (conf.autoReload && changed) {
            return this.reload(name);
        }
        var command = require(getPath(name));
        command.name = name;
        return command;
    },
    reload: function(name) {
        var command = reload(getPath(name));
        command.name = name;
        return command;
    },
    run: function(name, bot, m, prefix) {
        var command = this.load(name);
        var args = m.content.replace(/\[\?\]/ig, "").split(" ");
        args.shift();
        var argsString = args.join(" ");
        m.prefix = prefix;
        logCommand(m, prefix, name, argsString, true);
        try {
            command.main(bot, m, argsString, prefix);
        }
        catch (err) {
            console.log(err);
            m.reply("An error has occured.");
            logCommand(m, prefix, name, argsString, false);
        }
    }
};
