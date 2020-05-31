"use strict";

const Eris = require("eris");

/**
 * @class Client
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/Client|Eris.Client}
 */

/**
 * Get user id of the bot's owner
 *
 * @memberof module:erisplus.Client#
 * @function
 * @returns {Promise.<String>}
 */
async function getOwnerID() {
    var bot = this;
    var appinfo = await bot.getOAuthApplication();
    return appinfo.team && appinfo.team.owner_user_id || appinfo.owner.id;
}

function patch() {
    Object.defineProperty(Eris.Client.prototype, "getOwnerID", { value: getOwnerID });
}

module.exports = {
    patch
};
