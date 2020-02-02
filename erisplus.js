"use strict";

const misc = require("./misc");

function init(Eris) {
    /**
     * @external Message
     */
    /**
     * @external Member
     */
    /**
     * @external User
     */
    /**
     * @external Client
     */

    /**
     * The guild this message was sent to (if sent to a guild)
     *
     * @memberOf external:Message#
     * @member guild
     */
    Object.defineProperty(Eris.Message.prototype, "guild", {
        get: function() {
            return this.channel.guild;
        }
    });

    /**
     * The Eris Client instance
     *
     * @memberOf external:Message#
     * @member bot
     */
    Object.defineProperty(Eris.Message.prototype, "bot", {
        get: function() {
            var m = this;
            return m._client;
        }
    });

    /**
     * Reply to the message
     * @memberOf external:Message#
     * @member reply
     * @arg {String | Array | Object} content A string, array of strings, or object. If an object is passed:
     * @arg {String} content.content A content string
     * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
     * @arg {Boolean} [content.tts] Set the message TTS flag
     * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
     * @arg {Number} [timeout] If provided, how long in milliseconds to display the message before deleting it
     * @returns {Promise<Message>}
     */
    Object.defineProperty(Eris.Message.prototype, "reply", {
        value: async function(content, timeout) {
            var m = this;

            var file = null;
            if (content.file) {
                file = {
                    file: content.file,
                    name: content.name
                };
                delete content.file;
                delete content.name;
            }

            var sentMsg = m.channel.createMessage(content, file);

            if (timeout) {
                sentMsg.then(m => m.deleteIn(timeout));
            }

            return sentMsg;
        }
    });

    /**
     * Delete a message after a timeout
     * @memberOf external:Message#
     * @member deleteIn
     * @arg {Number} [timeout] How long in milliseconds to wait before deleting the message
     */
    Object.defineProperty(Eris.Message.prototype, "deleteIn", {
        value: async function(timeout) {
            var m = this;

            if (!timeout) {
                return m;
            }

            await misc.delay(timeout);
            try {
                await m.delete("Timeout");
            }
            catch (err) {
                if (err.code === 50013) {
                    console.warn("WRN".black.bgYellow
                        + " Missing Permissions for update".magenta.bold
                        + " - ".blue.bold + m.guild.name.cyan.bold
                        + " > ".blue.bold + "#" + m.channel.name.green.bold
                        + " (" `https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`.bold.red
                        + ")");
                }
                else {
                    console.error(err);
                }
            }

            return m;
        }
    });

    /**
     * The member's nickname, or username if no nickname is set
     * @memberOf external:Member#
     * @member {String} name
     */
    Object.defineProperty(Eris.Member.prototype, "name", {
        get: function() {
            var member = this;
            return member.nickname || member.username;
        }
    });

    /**
     * The user's username
     *
     * @memberOf external:User#
     * @member {String} name
     */
    Object.defineProperty(Eris.User.prototype, "name", {
        get: function() {
            var user = this;
            return user.username;
        }
    });

    return Eris;
}

module.exports = init;
