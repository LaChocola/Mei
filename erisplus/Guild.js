"use strict";

const Eris = require("eris");

/**
 * @class Guild
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/Guild|Eris.Guild}
 */

/**
 * The number of bots in this guild
 *
 * @memberof module:erisplus.Guild#
 * @member {number} botCount
 */
function getBotCount() {
    // When a guild is first loaded, guild.members contain all members who are either online, have a role, or have a guild nick.
    // If a bot is offline, has no roles, and has no guild nick, it will be missing from guild.botCount
    return this.members.filter(m => m.bot).length;
}

/**
 * The number of non-bot members in this guild
 *
 * @memberof module:erisplus.Guild#
 * @member {number} realMemberCount
 */
function getRealMemberCount() {
    return this.memberCount - this.botCount;
}

function patch() {
    Object.defineProperty(Eris.Guild.prototype, "botCount", { get: getBotCount });
    Object.defineProperty(Eris.Guild.prototype, "realMemberCount", { get: getRealMemberCount });
}

module.exports = {
    patch
};

