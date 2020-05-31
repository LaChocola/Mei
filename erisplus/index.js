"use strict";

const Eris = require("eris");
const Client = require("./Client");
const Guild = require("./Guild");
const Member = require("./Member");
const Message = require("./Message");
const PrivateChannel = require("./PrivateChannel");
const TextChannel = require("./TextChannel");
const User = require("./User");

/**
 * @module erisplus
 */

/**
 * @external Eris
 * @see {@link https://abal.moe/Eris/docs}
 */

Client.patch();
Guild.patch();
Member.patch();
Message.patch();
PrivateChannel.patch();
TextChannel.patch();
User.patch();

module.exports = Eris;
