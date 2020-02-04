"use strict";

const mongoose = require("mongoose");
const { UserId } = require("./types");

const Schema = mongoose.Schema;

var schema = new Schema({
    banned: [{
        userid: UserId,
        reason: String
    }],
    totalCommandUses: { type: Number, default: 0 }
});

// Singleton: get or create global data
schema.static.get = async function() {
    const Global = this;
    var globaldata = await Global.findOne();
    if (!globaldata) {
        globaldata = await Global.create();
    }
    return globaldata;
};

module.exports = mongoose.model("Global", schema);
