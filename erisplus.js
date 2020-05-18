"use strict";

const misc = require("./misc");

function init(Eris) {
    /**
     * @external Guild
     */
    /**
     * @external Message
     */
    /**
     * @external PrivateChannel
     */
    /**
     * @external TextChannel
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
     * The number of bots in this guild
     *
     * @memberOf external:Guild#
     * @member botCount
     */
    Object.defineProperty(Eris.Guild.prototype, "botCount", {
        get: function() {
            // When a guild is first loaded, guild.members contain all members who are either online, have a role, or have a guild nick.
            // If a bot is offline, has no roles, and has no guild nick, it will be missing from guild.botCount
            return this.members.filter(m => m.bot).length;
        }
    });

    /**
     * The number of non-bot members in this guild
     *
     * @memberOf external:Guild#
     * @member realMemberCount
     */
    Object.defineProperty(Eris.Guild.prototype, "realMemberCount", {
        get: function() {
            return this.memberCount - this.botCount;
        }
    });

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

    function channelSend(content, timeout) {
        var channel = this;

        var file = null;
        if (content.file) {
            file = {
                file: content.file,
                name: content.name
            };
            delete content.file;
            delete content.name;
        }

        var sentMsg = channel.createMessage(content, file);

        if (timeout) {
            sentMsg.then(m => m.deleteIn(timeout));
        }
        return sentMsg;
    }

    /**
     * Send a message to a Channel
     *
     * @memberOf external:PrivateChannel#
     * @member send
     * @arg {String | Array | Object} content A string, array of strings, or object. If an object is passed:
     * @arg {String} content.content A content string
     * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
     * @arg {Boolean} [content.tts] Set the message TTS flag
     * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
     * @arg {Number} [timeout] If provided, how long in milliseconds to display the message before deleting it
     * @arg {Boolean} [clean] If provided, whether to delete the original message or not.
     * @returns {Promise<Message>}
     */
    Object.defineProperty(Eris.PrivateChannel.prototype, "send", {
        value: channelSend
    });

    /**
     * Send a message to a Channel
     *
     * @memberOf external:TextChannel#
     * @member send
     * @arg {String | Array | Object} content A string, array of strings, or object. If an object is passed:
     * @arg {String} content.content A content string
     * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
     * @arg {Boolean} [content.tts] Set the message TTS flag
     * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
     * @arg {Number} [timeout] If provided, how long in milliseconds to display the message before deleting it
     * @arg {Boolean} [clean] If provided, whether to delete the original message or not.
     * @returns {Promise<Message>}
     */
    Object.defineProperty(Eris.TextChannel.prototype, "send", {
        value: channelSend
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
     * @arg {Boolean} [clean] If provided, whether to delete the original message or not.
     * @returns {Promise<Message>}
     */
    Object.defineProperty(Eris.Message.prototype, "reply", {
        value: async function(content, timeout, clean) {
            var m = this;
            if (clean) {
                m.deleteIn(timeout);
            }
            return await m.channel.send(content, timeout);
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

            if (timeout) {
                misc.delay(timeout).then(async function() {
                    try {
                        await m.delete("Timeout");
                    }
                    catch (err) {
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
                    }
                });
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
            return member.nick || member.username;
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

    /**
     * The member's full name (username#discriminator)
     *
     * @memberOf external:Member#
     * @member {String} fullname
     */
    Object.defineProperty(Eris.Member.prototype, "fullname", {
        get: function() {
            var member = this;
            return member.user.fullname;
        }
    });

    /**
     * The user's full name (username#discriminator)
     *
     * @memberOf external:User#
     * @member {String} fullname
     */
    Object.defineProperty(Eris.User.prototype, "fullname", {
        get: function() {
            var user = this;
            return `${user.username}#${user.discriminator}`;
        }
    });

    return Eris;
}

module.exports = init;
