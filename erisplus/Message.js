"use strict";

const Eris = require("eris");

const { delay } = require("./utils");

/**
 * @class Message
 * @memberof module:erisplus
 * @see {@link https://abal.moe/Eris/docs/Message|Eris.Message}
 */

/**
 * The guild this message was sent to (if sent to a guild)
 *
 * @memberof module:erisplus.Message#
 * @member {Guild} guild
 */
function getGuild() {
    return this.channel.guild;
}

/**
 * The Eris Client instance
 *
 * @memberof module:erisplus.Message#
 * @member {Client} bot
 */
function getBot() {
    var m = this;
    return m._client;
}

/**
 * Reply to the message
 *
 * @memberof module:erisplus.Message#
 * @function reply
 * @param {String | Array | Object} content A string, array of strings, or object. If an object is passed:
 * @param {String} [content.content] A content string
 * @param {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
 * @param {Boolean} [content.tts] Set the message TTS flag
 * @param {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
 * @param {Object | Array.<Object>} [content.file] A file object (or an Array of them)
 * @param {Buffer} [content.file.file] A buffer containing file data
 * @param {String} [content.file.name] What to name the file
 * @param {Number} [timeout] If provided, how long in milliseconds to display the message before deleting it
 * @param {Boolean} [clean] If provided, whether to delete the original message or not.
 * @returns {Promise<Message>}
 */
async function reply(content, timeout, clean) {
    var m = this;

    var sentMsg = m.channel.send(content, timeout);

    if (clean) {
        m.deleteIn(timeout);
    }

    return sentMsg;
}

/**
 * Delete the message after a timeout
 *
 * @memberof module:erisplus.Message#
 * @function deleteIn
 * @param {Number} [timeout] How long in milliseconds to wait before deleting the message
 * @returns {Message}
 */
async function deleteIn(timeout) {
    var m = this;

    if (!timeout) {
        return m;
    }

    delay(timeout)
        .then(async function() {
            await m.delete("Timeout");
        })
        .catch(function(err) {
            if (err.code === 50013) {
                console.warn("WRN".black.bgYellow
                + " Missing Permissions for update".magenta.bold
                + " - ".blue.bold + m.guild.name.cyan.bold
                + " > ".blue.bold + "#" + m.channel.name.green.bold
                + " (" + `https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`.bold.red
                + ")");
                return;
            }
            if (err.code === 10008) {
                console.warn("WRN".black.bgYellow
                + " Message provided is unknown or missing".magenta.bold
                + " - ".blue.bold + m.guild.name.cyan.bold
                + " > ".blue.bold + "#" + m.channel.name.green.bold
                + " (" + `https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`.bold.red
                + ")");
                return;
            }
            console.error(err);
        });

    return m;
}

function patch() {
    Object.defineProperty(Eris.Message.prototype, "guild", { get: getGuild });
    Object.defineProperty(Eris.Message.prototype, "bot", { get: getBot });
    Object.defineProperty(Eris.Message.prototype, "reply", { value: reply });
    Object.defineProperty(Eris.Message.prototype, "deleteIn", { value: deleteIn });
}

module.exports = {
    patch
};
