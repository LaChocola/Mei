module.exports = {
    main: function(Bot, m, args, prefix) {
      console.log('Args', args);
        // Using cleanContent removes user mentions from the message to avoid spam.
        var msg = m.cleanContent.replace(`${prefix}say `, "");
        if (m.content == `${prefix}say`) {
            Bot.createMessage(m.channel.id, "Please add something to say. i.e. ``!say <whatever>``")
            return
        } else {
          console.log(msg);
            Bot.createMessage(m.channel.id, msg);
        }
    },
    help: "Makes me say something"
}
