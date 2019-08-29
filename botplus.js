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
            var userMsg = this;
            var bot = userMsg._client;
            var channelId = userMsg.channel.id;
            var botMsg = await bot.createMessage(channelId, text);
            if (timeout) {
                await utils.delay(timeout);
                bot.deleteMessage(channelId, userMsg.id, "Timeout");
                bot.deleteMessage(channelId, botMsg.id, "Timeout");
            }
        }
    });
}

module.exports = {
    extend
};
