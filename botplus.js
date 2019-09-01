"use strict";

const utils = require("./utils");

function extend(bot) {
    Object.defineProperty(bot.Message.prototype, "guild", {
        get: function() {
            return this.channel.guild;
        }
    });

    // returns promise for sent message
    Object.defineProperty(bot.Message.prototype, "reply", {
        value: async function(text, timeout) {
            var m = this;
            var bot = m._client;
            var channelId = m.channel.id;
            var sentMsg = bot.createMessage(channelId, text);
            if (timeout) {
                return sentMsg.then(m => m.deleteIn(timeout));
            }
            return sentMsg;
        }
    });

    // Returns message to be deleted
    Object.defineProperty(bot.Message.prototype, "deleteIn", {
        value: async function(timeout) {
            var m = this;

            if (!timeout) {
                return;
            }

            return utils.delay(timeout).then(function() {
                return m.delete("Timeout");
            });
        }
    });
}

module.exports = {
    extend
};
