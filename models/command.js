"use strict";

const mongoose = require("mongoose");
const { UserId } = require("./types");

const Schema = mongoose.Schema;

var schema = new Schema({
    name: { type: UserId, required: true, unique: true },
    uses: {
        total: { type: Number, default: 0 },
        users: [{
            userid: UserId,
            uses: { type: Number, default: 0 }
        }]
    }
});

// Try to get a command by the command name, and if none is found, return an empty command
schema.static.get = async function(name) {
    const Command = this;
    var commanddata = await Command.findOne({ name: name });
    if (!commanddata) {
        commanddata = await Command.create({ name: name });
    }
    return commanddata;
};

// Increment a user's use of a command
schema.methods.incrementUser = function(userid) {
    const commanddata = this;
    commanddata.totalUses++;
    var usercommanddata = commanddata.users.find(u => u.userid === userid);
    if (!usercommanddata) {
        usercommanddata = { userid: userid, uses: 0 };
        commanddata.users.push(usercommanddata);
    }
    usercommanddata.uses += 1;
};

module.exports = mongoose.model("Command", schema);
