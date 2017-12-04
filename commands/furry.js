const Jimp = require('jimp');
module.exports = {
    main: function(Bot, m, args) {
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
        if (m.mentions.length > 1) {
            Bot.createMessage(m.channel.id, "This Command can't be used with more than one mention")
            return;
        }
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
        if (name.length > 10) {
            var name = name.slice(0, 10) + ".."
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            try {
                const bg = await Jimp.read("https://buttsare.sexy/b3e262.jpg");
                const nameFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                bg.clone()
                    .print(nameFont, 550, 145, name)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        Bot.createMessage(m.channel.id, `Weirdo`, {
                            "file": buffer,
                            "name": "furry.png"
                        })
                    });
            } catch (error) {
                console.log(error);
                return Bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: "idk",
    type: "Image Command"
}