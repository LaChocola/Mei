"use strict";

const mongoose = require("mongoose");
const { GuildId, UserId, ChannelId, RoleId, MessageId } = require("./types");

const Schema = mongoose.Schema;

var schema = new Schema({
    guildid: { type: GuildId, required: true, unique: true },
    name: String,
    ownerid: UserId,
    art: ChannelId,
    mods: [UserId],
    modRoles: [RoleId],
    hoards: { type: Boolean, default: true },
    notifications: {
        banlog: ChannelId,
        updates: ChannelId,
        welcome: {
            channel: ChannelId,
            message: String
        },
        leave: {
            channel: ChannelId,
            message: String
        }
    },
    prefix: String,
    hoardMilestones: {
        enabled: { type: Boolean, default: true },
        displayTime: { type: Number, default: 60000 }
    },
    roles: [{
        roleid: RoleId,
        rolename: String
    }],
    giveaway: {
        running: Boolean,
        description: String,
        contestants: [UserId],
        creator: UserId,
        message: MessageId,
        channel: ChannelId
    },
    music: {
        queue: [{
            youtubeid: String,
            requester: String
        }],
        current: {
            youtubeid: String,
            requester: String
        }
    },
    game: {
        channel: ChannelId,
        player: UserId,
        active: Boolean,
        choices: [String]
    }
});

// Try to get a guild by the guild id, and if none is found, return an empty guild
schema.static.get = async function(guildid) {
    const Guild = this;
    var guilddata = await Guild.findOne({ guildid: guildid });
    if (!guilddata) {
        guilddata = await Guild.create({ guildid: guildid });
    }
    return guilddata;
};

module.exports = mongoose.model("Guild", schema);
