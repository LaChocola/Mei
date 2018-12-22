const util = require("util");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var coolkids = ["161027274764713984", "176975815072808960", "147383057844797441", "103832588556193792", "196026737019191296"];
        if (coolkids.indexOf(m.author.id) > -1) {
            var u;
            if (args.indexOf("--util") > -1) {
                u = true;
                args = args.replace("--util", "");
            }
            try {
                var ev = await eval(args);
                if (u) {
                    ev = util.inspect(ev)
                }
                Bot.createMessage(m.channel.id, ev);
                console.log(ev);
            } catch (err) {
                Bot.createMessage(m.channel.id, err);
            }
        } else {
            Bot.createMessage(m.channel.id, "No, dont touch that");
        }
    },
    help: "Just dont",
    hidden: true
};
