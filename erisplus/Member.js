"use strict";

const Eris = require("eris");

/**
 * @class Member
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/Member|Eris.Member}
 */

/**
 * The member's nickname, or username if no nickname is set
 *
 * @memberof module:erisplus.Member#
 * @member {String} name
 */
function getName() {
    var member = this;
    return member.nick || member.username;
}

/**
 * The member's full name (username#discriminator)
 *
 * @memberof module:erisplus.Member#
 * @member {String} fullname
 */
function getFullname() {
    var member = this;
    return member.user.fullname;
}

function patch() {
    Object.defineProperty(Eris.Member.prototype, "name", { get: getName });
    Object.defineProperty(Eris.Member.prototype, "fullname", { get: getFullname });
}

module.exports = {
    patch
};
