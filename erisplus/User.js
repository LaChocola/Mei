"use strict";

const Eris = require("eris");

/**
 * @class User
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/User|Eris.User}
 */

/**
 * The user's username
 *
 * @memberof module:erisplus.User#
 * @member {String} name
 */
function getName() {
    var user = this;
    return user.username;
}

/**
 * The user's full name (username#discriminator)
 *
 * @memberof module:erisplus.User#
 * @member {String} fullname
 */
function getFullname() {
    var user = this;
    return `${user.username}#${user.discriminator}`;
}

function patch() {
    Object.defineProperty(Eris.User.prototype, "name", { get: getName });
    Object.defineProperty(Eris.User.prototype, "fullname", { get: getFullname });
}

module.exports = {
    patch
};
