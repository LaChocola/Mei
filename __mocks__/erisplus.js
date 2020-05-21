"use strict";

const copyGetter = require("./helpers/copyGetter");
const Eris = jest.genMockFromModule("../erisplus");
const orig = jest.requireActual("../erisplus");

Eris.Message.mockImplementation(function(data) {
    if (data) {
        if (data.id) {
            this.id = data.id;
        }
        if (data.content !== undefined) {
            this.content = data.content;
        }
        if (data.author !== undefined) {
            this.author = data.author;
        }
    }
});

Eris.User.mockImplementation(function(data) {
    if (data && data.id) {
        this.id = data.id;
    }
});
copyGetter(orig.User, Eris.User, "mention");
copyGetter(orig.User, Eris.User, "defaultAvatar");
copyGetter(orig.User, Eris.User, "defaultAvatarURL");

Eris.Member.mockImplementation(function(data) {
    if (data && data.id) {
        this.id = data.id;
    }
});
Object.defineProperty(Eris.Member.prototype, "id", {
    get: function() {
        return this.user.id;
    },
    set: function(id) {
        this.user.id = id;
    }
});
copyGetter(orig.Member, Eris.Member, "username");
copyGetter(orig.Member, Eris.Member, "discriminator");
copyGetter(orig.Member, Eris.Member, "avatar");
copyGetter(orig.Member, Eris.Member, "bot");
copyGetter(orig.Member, Eris.Member, "createdAt");
copyGetter(orig.Member, Eris.Member, "defaultAvatar");
copyGetter(orig.Member, Eris.Member, "defaultAvatarURL");
copyGetter(orig.Member, Eris.Member, "staticAvatarURL");
copyGetter(orig.Member, Eris.Member, "avatarURL");
copyGetter(orig.Member, Eris.Member, "mention");

Eris.Client.mockImplementation(function() {
    this.groupChannels = new orig.Collection(Object);
    this.guilds = new orig.Collection(Object);
    this.privateChannels = new orig.Collection(Object);
    this.unavailableGuilds = new orig.Collection(Object);
    this.relationships = new orig.Collection(Object);
    this.users = new orig.Collection(Object);
});

Eris.Role.mockImplementation(function(data) {
    if (data && data.id) {
        this.id = data.id;
    }
});
copyGetter(orig.Role, Eris.Role, "json");
copyGetter(orig.Role, Eris.Role, "mention");

Eris.Guild.mockImplementation(function(data) {
    if (data && data.id) {
        this.id = data.id;
    }
    this.voiceStates = new orig.Collection(Object);
    this.channels = new orig.Collection(Object);
    this.members = new orig.Collection(Object);
    this.roles = new orig.Collection(Object);
});

Eris.TextChannel.mockImplementation(function(data) {
    if (data && data.id) {
        this.id = data.id;
    }
    if(data.name !== undefined) {
        this.name = data.name;
    }
    this.messages = new orig.Collection(Object);
});

Eris.Permission.mockImplementation(function(allow, deny) {
    this.allow = allow || 0;
    this.deny = deny || 0;
    this.messages = new orig.Collection(Object);
});
copyGetter(orig.Permission, Eris.Permission, "json");
Eris.Permission.prototype.has.mockImplementation(orig.Permission.prototype.has);

module.exports = Eris;
