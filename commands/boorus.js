module.exports = {
	main(Bot, m) {
		Bot.createMessage(m.channel.id, '**Total Boorus Availible:** 16\n**Default Booru:** giantessbooru.com \n\n**Other Availbe Boorus | Aliases:**\n***giantessbooru*** | gtsbooru, gbooru\n***e621*** | e6, e621, e9, e926\n***hypnohub*** | hh, hypno\n***danbooru*** | db\n***konachan*** | kc, konan\n***yande.re*** | yd, yand\n***gelbooru*** | gb, gel\n***rule34*** | r34\n***safebooru*** | sb\n***thebigimagebooru*** | tb, tbib\n***xbooru*** | xb\n***youhate*** | yh\n***dollbooru***\n***derpibooru*** | dp, derpi\n***furrybooru*** | fb \n***realbooru***');
	},
	help: 'Boorus availible in ``!booru``'
};
