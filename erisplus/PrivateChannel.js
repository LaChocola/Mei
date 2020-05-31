"use strict";

const Eris = require("eris");

/**
 * @class PrivateChannel
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/PrivateChannel|Eris.PrivateChannel}
 */

/**
 * Reply to the message
 *
 * @memberof module:erisplus.PrivateChannel#
 * @function send
 * @param {String | Array | Object} content A string, array of strings, or object. If an object is passed:
 * @param {String} [content.content] A content string
 * @param {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
 * @param {Boolean} [content.tts] Set the message TTS flag
 * @param {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
 * @param {Object | Array.<Object>} [content.file] A file object (or an Array of them)
 * @param {Buffer} [content.file.file] A buffer containing file data
 * @param {String} [content.file.name] What to name the file
 * @param {Number} [timeout] If provided, how long in milliseconds to display the message before deleting it
 * @returns {Promise<Message>}
 */
function send(content, timeout) {
    var channel = this;

    var file = content.file;
    delete content.file;

    var sentMsg = channel.createMessage(content, file);

    if (timeout) {
        sentMsg.then(m => m.deleteIn(timeout));
    }
    return sentMsg;
}

function patch() {
    Object.defineProperty(Eris.PrivateChannel.prototype, "send", { value: send });
}

module.exports = {
    patch
};
