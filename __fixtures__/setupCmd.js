"use strict";

const Eris = require("../erisplus");

jest.mock("../erisplus");
/*
 * # Users
 * Bot: Nei (615778246180601876)
 * Server owner: Natalie (137269976255037440)
 * Mod: DigiDuncan (271803699095928832)
 * ModRole: Kelly (236336628828733443)
 * Chocola: Chocola (161027274764713984)
 * administrator permission: Rel (338386561572012032)
 * banMembers permission: Arceus (239598274103738369)
 * Unauthorized User: AWK (236223047093321728)
 * Target: Pete Smith (435088936730361858)
 * Second Target: Nelly (310836984388124672)
 *
 * # Roles
 * ModRole: Code Monkey (658900877956087808)
 */

global.setupCmd = function(command, args) {
    var prefix = "!";
    args = args || "";

    var guild = new Eris.Guild({ id: "161027274764713984" });
    guild.name = "SizeDev";
    guild.ownerID = "137269976255037440";
    guild.roles.add({ id: "658900877956087808", name: "Code Monkey" });
    guild.roles.add({ id: "658899545941344266", name: "Mei" });
    guild.roles.add({ id: "660223194766245891", name: "Sizebot" });

    var channel = new Eris.TextChannel({ id: "658894691311550474", name: "Testing Channel" });
    channel.guild = guild;
    channel.permissionsOf.mockReturnValue(new Eris.Permission(1024));
    guild.channels.add(channel);

    var user = new Eris.User({ id: "137269976255037440" });
    user.username = "Natalie";
    user.avatarURL = "https://cdn.discordapp.com/avatars/137269976255037440/a_1ef11f3e09a2bd2c07b9c881d614d287.gif?size=128";
    user.avatar = "a_1ef11f3e09a2bd2c07b9c881d614d287";
    user.dynamicAvatarURL.mockReturnValue("https://cdn.discordapp.com/avatars/137269976255037440/a_1ef11f3e09a2bd2c07b9c881d614d287.gif?size=1024");

    var member = new Eris.Member();
    member.user = user;
    member.name = "Natalie";
    member.roles = [];
    member.permission = new Eris.Permission(1024);
    guild.members.add(member);

    var botUser = new Eris.User({ id: "615778246180601876" });

    var peteSmithUser = new Eris.User({ id: "435088936730361858" });
    peteSmithUser.fullname = "Pete Smith#1234";
    var nellyUser = new Eris.User({ id: "310836984388124672" });
    nellyUser.fullname = "Nelly#5678";

    var bot = new Eris.Client();
    bot.users.add(peteSmithUser);
    bot.users.add(nellyUser);
    bot.users.add(user);
    bot.createMessage.mockResolvedValue(new Eris.Message({ id: "2" }));
    bot.uptime = 1000;
    bot.getChannel.mockReturnValue(channel);
    bot.user = botUser;
    bot.getMessages.mockResolvedValue([
        new Eris.Message({ id: "137269976255037440", content: "Message One", author: user }),
        new Eris.Message({ id: "137269976255037441", content: "Message Two", author: user }),
        new Eris.Message({ id: "137269976255037442", content: "Message Three", author: user })
    ]);

    var m = new Eris.Message({ id: "1", content: `${prefix}${command} ${args}`.trim() });
    m.author = user;
    m.channel = channel;
    m.member = member;
    m.cleanContent = m.content;
    m.mentions = [];
    m.channelMentions = [];
    m.guild = guild;

    return { bot, m, args, prefix };
};
