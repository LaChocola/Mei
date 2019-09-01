"use strict";

const utils = require("./utils");

function extend(bot) {
    Object.defineProperty(bot.Message.prototype, "guild", {
        get: function() {
            return this.channel.guild;
        }
    });

    Object.defineProperty(bot.Message.prototype, "reply", {
        value: async function(text, timeout) {
            var m = this;
            var bot = m._client;
            var channelId = m.channel.id;
            var sentMsg = await bot.createMessage(channelId, text);
            if (timeout) {
                sentMsg.deleteIn(timeout);
            }
            return sentMsg;
        }
    });

    Object.defineProperty(bot.Message.prototype, "deleteIn", {
        value: async function(timeout) {
            if (!timeout) {
                return;
            }
            var m = this;
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
