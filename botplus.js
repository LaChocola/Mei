﻿"use strict";

const utils = require("./utils");
const dbs = require("./dbs");

function extend(bot) {
    Object.defineProperty(bot.Message.prototype, "guild", {
        get: function() {
            return this.channel.guild;
        }
    });

    // Returns promise for sent message
    Object.defineProperty(bot.Message.prototype, "bot", {
        get: function() {
            var m = this;
            return m._client;
        }
    });

    // Returns promise for sent message
    Object.defineProperty(bot.Message.prototype, "reply", {
        value: async function(text, timeout) {
            var m = this;

            var sentMsg = m.bot.createMessage(m.channel.id, text);
            if (timeout) {
                sentMsg.then(m => m.deleteIn(timeout));
            }
            return sentMsg;
        }
    });

    // Returns message to be deleted
    Object.defineProperty(bot.Message.prototype, "deleteIn", {
        value: function(timeout) {
            var m = this;

            if (!timeout) {
                return m;
            }

            utils.delay(timeout).then(function() {
                m.delete("Timeout");
            });

            return m;
        }
    });

    Object.defineProperty(bot.Member.prototype, "isMod", {
        value: async function() {
            var member = this;
            var guild = member.guild;
            var guildDb = await dbs.guild.load();
            var guildData = guildDb[guild.id] || {};

            // Check if member is the guild owner
            var isOwner = member.id === guild.ownerID;
            if (isOwner) {
                return true;
            }

            // Check if member is in the list of guild mods
            var isMod = guildData.mods && guildData.mods[member.id];
            if (isMod) {
                return true;
            }

            // Check if member has one of the mod roles
            var modRoles = guildData.modRoles && Object.keys(guildData.modRoles) || [];
            var hasModRole = modRoles.some(r => member.roles.includes(r));
            if (hasModRole) {
                return true;
            }

            return false;
        }
    });

    //member.hasPerms(["banMembers", "administrator", "manageGuild", "manageChannels", "manageMessages"]);  // "!clean" command
    //member.hasPerms(["banMembers", "administrator", "manageGuild", "manageChannels"]);                    // "!edit" command
    //member.hasPerms(["banMembers", "administrator", "manageGuild"]);                                      // "!ban" command
    Object.defineProperty(bot.Member.prototype, "hasPerms", {
        get: async function(perms) {
            var member = this;
            // Make a Set() of all member permissions that are set to true
            var memberPerms = new Set(Object.keys(member.permission.json.filter(p => p)));
            var hasPerm = perms.some(p => memberPerms.has(p));
            return hasPerm;
        }
    });
}

module.exports = {
    extend
};
