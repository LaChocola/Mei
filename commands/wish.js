const Jimp = require('jimp');
var time = new Date().toDateString().slice(4).replace(` ${new Date().getFullYear()}`, `, ${new Date().getFullYear()}`)
module.exports = {
    main: function(Bot, m, args, prefix) {
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == m.author.username.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member || m.author
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
        if (name.length > 11) {
            var name = name.slice(0, 11) + ".."
        }
        var pic = `https://images.discordapp.net/avatars/${m.author.id}/${m.author.avatar}.png?size=1024`
        if (pic.includes("null")) {
          Bot.createMessage(m.channel.id, "You need an avatar to use this command");
          return;
        }
        if (m.mentions.length == 1) {
            var pic = `https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`
        } else if (m.mentions.length > 1) {
            Bot.createMessage(m.channel.id, "This Command can't be used with more than one mention")
            return;
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            try {
                const bg = await Jimp.read("https://buttsare.sexy/c3b78e.jpg");
                const avy = await Jimp.read(pic);
                const nameFont = await Jimp.loadFont(Jimp.FONT_TREBUCHET);
                const timeFont = await Jimp.loadFont(Jimp.FONT_TIMEFONT);
                avy.resize(141, 116);
                bg.clone()
                    .blit(avy, 15, 5)
                    .print(nameFont, 215, 30, name)
                    .print(timeFont, 460, 37, time)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        Bot.createMessage(m.channel.id, `Look what I found~`, {
                            "file": buffer,
                            "name": "wish.png"
                        })
                    });
            } catch (error) {
                console.log(error);
                return Bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: "God, I wish that were me",
    type: "Image Command"
}
