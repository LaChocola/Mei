"use strict";

const mongoose = require("mongoose");
const { UserId } = require("./types");

const Schema = mongoose.Schema;

var schema = new Schema({
    userid: { type: UserId, required: true, unique: true },
    links: [{
        name: { type: String, required: true, unique: true },
        url: String
    }],
    fetishes: [{
        name: { type: String, required: true, unique: true },
        like: { type: String, enum: ["like", "dislike"] }
    }],
    hoards: [{
        emoji: { type: String, required: true, unique: true },
        items: [{
            url: { type: String, required: true, unique: true },
            authorid: UserId
        }]
    }],
    adds: { type: Number, default: 0 },
    names: [{
        name: { type: String, required: true, unique: true },
        gender: { type: String, enum: ["male", "female", "futa"], default: "female" }
    }]
});

// Automatically add a 😍 hoard to every new user
schema.methods.initHoards = function() {
    var userdata = this;
    userdata.hoards.push({ emoji: "😍" });
};
schema.queue("initHoards");

// Try to get a user by the user id, and if none is found, return an empty guild
schema.static.get = async function(userid) {
    const User = this;
    var userdata = await User.findOne({ userid: userid });
    if (!userdata) {
        userdata = await User.create({ userid: userid });
    }
    return userdata;
};

module.exports = mongoose.model("User", schema);
