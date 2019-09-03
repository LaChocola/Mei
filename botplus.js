"use strict";

const utils = require("./utils");

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
}

module.exports = {
    extend
};
