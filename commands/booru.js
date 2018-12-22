const booru = require('booru');

let request = require('request');

request = request.defaults({jar: true});
const cheerio = require('cheerio');
const _ = require('../people.js');

let people = _.load();

module.exports = {
	main(Bot, m, args, prefix) {
		function isNumeric(num) {
			return !isNaN(Number(num));
		}
		if (m.author.id == '187368906493526017') {
			return;
		}
		if (m.channel.nsfw == false) {
			Bot.createMessage(m.channel.id, 'This command can only be used in NSFW channels');
			return;
		}
		const name = m.author.nick || m.author.username;
		if (m.content.toLowerCase() == `${prefix}booru`) {
			m.content = `${prefix}booru giantess`;
		}
		if (m.content.toLowerCase() == `${prefix}booru list`) {
			Bot.createMessage(m.channel.id, '**Total Boorus Availible:** 16\n**Default Booru:** giantessbooru.com \n\n**Other Availbe Boorus | Aliases:**\n***giantessbooru*** | gtsbooru, gbooru\n***e621*** | e6, e621, e9, e926\n***hypnohub*** | hh, hypno\n***danbooru*** | db\n***konachan*** | kc, konan\n***yande.re*** | yd, yand\n***gelbooru*** | gb, gel\n***rule34*** | r34\n***safebooru*** | sb\n***thebigimagebooru*** | tb, tbib\n***xbooru*** | xb\n***youhate*** | yh\n***dollbooru***\n***derpibooru*** | dp, derpi\n***furrybooru*** | fb \n***realbooru***');
			return;
		}
		var args = m.cleanContent.toLowerCase().replace(`${prefix}booru `, '').split(', ');
		let site = 'giantessbooru.com';
		const imageURL = [];
		let tags = [];
  	const things = [];
		var limit = 1;
		const aliases = [
			'e6',
			'e621',
			'e9',
			'e926',
			'hh',
			'hypo',
			'hypohub',
			'db',
			'danbooru',
			'kc',
			'konan',
			'knet',
			'yd',
			'yand',
			'gb',
			'gel',
			'gelbooru',
			'r34',
			'rule34',
			'sb',
			'safebooru',
			'tb',
			'tbib',
			'xb',
			'xbooru',
			'yh',
			'youhate',
			'dollbooru',
			'pa',
			'paheal',
			'dp',
			'derpi',
			'derpibooru',
			'giantessbooru',
			'gtsbooru',
			'gbooru',
			'giantessbooru.com',
			'fb',
			'furrybooru',
			'realbooru'
		];
		const id = m.author.id;
		let furry = false;
		let male = false;
		let scat = false;
		const fetishes2 = {
			'GiantessKatelyn.com': 'dislike',
			Sheela: 'dislike',
			'_My Account': 'dislike',
			_Images: 'dislike',
			_Galleries: 'dislike',
			'\n_Comments': 'dislike',
			_Tags: 'dislike',
			_Upload: 'dislike',
			_Map: 'dislike',
			_Alphabetic: 'dislike',
			_Popularity: 'dislike',
			Synonym_Editor: 'dislike',
			'a-i-k-art': 'dislike',
			aaabbbzzz: 'dislike',
			above_view: 'dislike',
			abs: 'dislike',
			accasbel: 'dislike',
			acerok: 'dislike',
			adeline: 'dislike',
			adrianna_daniels: 'dislike',
			adventure_time: 'dislike',
			advertisement: 'dislike',
			aerial_view: 'dislike',
			aircraft_carrier: 'dislike',
			airplane: 'dislike',
			airport: 'dislike',
			airraid: 'dislike',
			ai_tanaka: 'dislike',
			'alice_in wonderland': 'dislike',
			alien: 'dislike',
			aliens: 'dislike',
			aliessa: 'dislike',
			amazon: 'dislike',
			amber_eyes: 'dislike',
			amgipi: 'dislike',
			amy_rose: 'dislike',
			anal: 'dislike',
			anal_insertion: 'dislike',
			angel: 'dislike',
			angelgts: 'dislike',
			'angle\'s_playground': 'dislike',
			'angle\'s_playground chapter 2': 'dislike',
			angry: 'dislike',
			animation: 'dislike',
			anime: 'dislike',
			ankles: 'dislike',
			ankle_bracelet: 'dislike',
			anthro: 'dislike',
			'apeiron-macro': 'dislike',
			armor: 'dislike',
			armpits: 'dislike',
			aroused: 'dislike',
			artistic: 'dislike',
			ashkiiwolf: 'dislike',
			asian: 'dislike',
			athletic: 'dislike',
			'attack_of the 50 foot woman': 'dislike',
			'attack_on titan': 'dislike',
			ayami6: 'dislike',
			back: 'dislike',
			'bakugeki_no g': 'dislike',
			bald: 'dislike',
			barefoot: 'dislike',
			bare_midriff: 'dislike',
			basketball: 'dislike',
			bath: 'dislike',
			bathroom: 'dislike',
			batman: 'dislike',
			battle: 'dislike',
			bay: 'dislike',
			bbw: 'dislike',
			beach: 'dislike',
			beach_goers: 'dislike',
			bed: 'dislike',
			bedroom: 'dislike',
			behind_view: 'dislike',
			belly: 'dislike',
			belt: 'dislike',
			bench: 'dislike',
			bending_over: 'dislike',
			beregous: 'dislike',
			between_breasts: 'dislike',
			between_buildings: 'dislike',
			between_buttcheeks: 'dislike',
			between_feet: 'dislike',
			between_fingers: 'dislike',
			between_legs: 'dislike',
			between_toes: 'dislike',
			big_butt: 'dislike',
			bikini: 'dislike',
			bikini_bottom: 'dislike',
			bikini_top: 'dislike',
			bikuta: 'dislike',
			birds: 'dislike',
			black_dress: 'dislike',
			black_hair: 'dislike',
			black_nails: 'dislike',
			bleach: 'dislike',
			blonde: 'dislike',
			blood: 'dislike',
			blowjob: 'dislike',
			blue_eyes: 'dislike',
			blue_hair: 'dislike',
			blue_nails: 'dislike',
			blue_skin: 'dislike',
			blushing: 'dislike',
			boats: 'dislike',
			bobbob: 'dislike',
			body_exploration: 'dislike',
			bondage: 'dislike',
			book: 'dislike',
			boomgts: 'dislike',
			boots: 'dislike',
			bottle: 'dislike',
			bottomless: 'dislike',
			bow: 'dislike',
			bowl: 'dislike',
			bra: 'dislike',
			bracelet: 'dislike',
			braid: 'dislike',
			breasts: 'dislike',
			breast_crush: 'dislike',
			breast_expansion: 'dislike',
			breast_play: 'dislike',
			bridge: 'dislike',
			brown_eyes: 'dislike',
			brunette: 'dislike',
			bruzzo: 'dislike',
			bugs: 'dislike',
			bugunderherfeet: 'dislike',
			buildings: 'dislike',
			building_sex: 'dislike',
			bulge: 'dislike',
			bunny: 'dislike',
			bunny_girl: 'dislike',
			burp: 'dislike',
			bus: 'dislike',
			business_woman: 'dislike',
			butre3004: 'dislike',
			butt: 'dislike',
			buttman: 'dislike',
			butt_crush: 'dislike',
			bystanders: 'dislike',
			cage: 'dislike',
			cake: 'dislike',
			camel_toe: 'dislike',
			camera: 'dislike',
			canadian_giantess: 'dislike',
			canine: 'dislike',
			cape: 'dislike',
			captain_rand: 'dislike',
			captions: 'dislike',
			captured: 'dislike',
			carg: 'dislike',
			carpet: 'dislike',
			cars: 'dislike',
			cartoon: 'dislike',
			castle: 'dislike',
			cat: 'dislike',
			cat_ears: 'dislike',
			cat_girl: 'dislike',
			caught: 'dislike',
			celebrity: 'dislike',
			censored: 'dislike',
			cerberus: 'dislike',
			chains: 'dislike',
			chair: 'dislike',
			chapter_3: 'dislike',
			chapter_4: 'dislike',
			cheerleader: 'dislike',
			chibichan: 'dislike',
			chicago: 'dislike',
			chief: 'dislike',
			chinese: 'dislike',
			choker: 'dislike',
			chopsticks: 'dislike',
			christmas: 'dislike',
			cigarette: 'dislike',
			city: 'dislike',
			city_lights: 'dislike',
			classroom: 'dislike',
			claws: 'dislike',
			cleavage: 'dislike',
			cliff: 'dislike',
			climbing: 'dislike',
			clit: 'dislike',
			closed_eyes: 'dislike',
			close_up: 'dislike',
			clothed: 'dislike',
			clothing: 'dislike',
			clouds: 'dislike',
			cock_vore: 'dislike',
			collage: 'dislike',
			collar: 'dislike',
			color: 'dislike',
			comic: 'dislike',
			comicalloner: 'dislike',
			commission: 'dislike',
			computer: 'dislike',
			converse: 'dislike',
			corset: 'dislike',
			cosmic_giantess: 'dislike',
			cosplay: 'dislike',
			costume: 'dislike',
			countryside: 'dislike',
			couple: 'dislike',
			covering_breasts: 'dislike',
			cover_page: 'dislike',
			cracked_pavement: 'dislike',
			cramped: 'dislike',
			crawling: 'dislike',
			crisis: 'dislike',
			crlvr: 'dislike',
			crotch: 'dislike',
			crouching: 'dislike',
			crowds: 'dislike',
			crown: 'dislike',
			cruel: 'dislike',
			cruise_ship: 'dislike',
			crush: 'dislike',
			crushed_car: 'dislike',
			crying: 'dislike',
			cum: 'dislike',
			curly_hair: 'dislike',
			curvy: 'dislike',
			cutaway: 'dislike',
			cute: 'dislike',
			cysh_aizen: 'dislike',
			'd.va': 'dislike',
			dangle: 'dislike',
			darkangle989: 'dislike',
			dark_skin: 'dislike',
			dawn: 'dislike',
			dc_comics: 'dislike',
			death: 'dislike',
			debris: 'dislike',
			'deja-two': 'dislike',
			demon: 'dislike',
			demoness: 'dislike',
			denise_milani: 'dislike',
			desert: 'dislike',
			desk: 'dislike',
			destruction: 'dislike',
			dialogue: 'dislike',
			diane: 'dislike',
			digestion: 'dislike',
			digital_render: 'dislike',
			'dinner-kun': 'dislike',
			dinosaur: 'dislike',
			dirty: 'dislike',
			dirty_soles: 'dislike',
			disney: 'dislike',
			docop: 'dislike',
			dofus59: 'dislike',
			dog: 'dislike',
			domination: 'dislike',
			dominatrix: 'dislike',
			downward_angle: 'dislike',
			dragon: 'dislike',
			dragoness: 'dislike',
			dragonesslife: 'dislike',
			dragon_ball: 'dislike',
			drawing: 'dislike',
			drawing_collage: 'dislike',
			drcreep: 'dislike',
			dress: 'dislike',
			drink: 'dislike',
			drinking: 'dislike',
			dripping: 'dislike',
			ducky: 'dislike',
			dust: 'dislike',
			e10: 'dislike',
			earrings: 'dislike',
			earth: 'dislike',
			eating: 'dislike',
			eichikei: 'dislike',
			eiffel_tower: 'dislike',
			elf: 'dislike',
			elizabeth: 'dislike',
			embarrassed: 'dislike',
			emi: 'dislike',
			emma: 'dislike',
			emma_watson: 'dislike',
			endlessrain0110: 'dislike',
			english: 'dislike',
			entrapment: 'dislike',
			ethan64: 'dislike',
			etz: 'dislike',
			eugen: 'dislike',
			explosion: 'dislike',
			eyes: 'dislike',
			eyes_closed: 'dislike',
			face: 'dislike',
			facesitting: 'dislike',
			fairy: 'dislike',
			fairy_tail: 'dislike',
			falling: 'dislike',
			fanart: 'dislike',
			fang: 'dislike',
			fangs: 'dislike',
			fantasy: 'dislike',
			fart: 'dislike',
			fater: 'dislike',
			'fate_(series)': 'dislike',
			feet: 'dislike',
			felarya: 'dislike',
			female: 'dislike',
			female_domination: 'dislike',
			fighting: 'dislike',
			final_fantasy: 'dislike',
			finger: 'dislike',
			fingers: 'dislike',
			finger_crush: 'dislike',
			fire: 'dislike',
			fishnets: 'dislike',
			fist: 'dislike',
			flagg3d: 'dislike',
			flexing: 'dislike',
			flip_flops: 'dislike',
			floor: 'dislike',
			flowers: 'dislike',
			flying: 'dislike',
			food: 'dislike',
			fooooly: 'dislike',
			foot_crush: 'dislike',
			foot_play: 'dislike',
			foot_pov: 'dislike',
			foot_print: 'dislike',
			foot_slave: 'dislike',
			foot_worship: 'dislike',
			foreign_text: 'dislike',
			forest: 'dislike',
			fotoche2000: 'dislike',
			fox: 'dislike',
			fox_ears: 'dislike',
			fox_girl: 'dislike',
			freckles: 'dislike',
			from_below: 'dislike',
			frozen: 'dislike',
			funny: 'dislike',
			furry: 'dislike',
			futanari: 'dislike',
			game: 'dislike',
			garcia_accasbel: 'dislike',
			gentle: 'dislike',
			gerald_nog: 'dislike',
			gestures: 'dislike',
			giant: 'dislike',
			giantess: 'dislike',
			giantessbuster209: 'dislike',
			giantesscity: 'dislike',
			giantesses: 'dislike',
			giantessfan: 'dislike',
			giantessstudios101: 'dislike',
			giantess_feet: 'dislike',
			giantess_katelyn: 'dislike',
			giantess_lover45: 'dislike',
			giantess_night: 'dislike',
			giantwaifus: 'dislike',
			giant_cock: 'dislike',
			giga: 'dislike',
			giganta: 'dislike',
			ginger: 'dislike',
			ginormica: 'dislike',
			girlfriend: 'dislike',
			giulio_10: 'dislike',
			glass: 'dislike',
			glasses: 'dislike',
			gloves: 'dislike',
			glowing_eyes: 'dislike',
			gmod: 'dislike',
			goblin: 'dislike',
			goddess: 'dislike',
			goggles: 'dislike',
			goingdown: 'dislike',
			golden_eyes: 'dislike',
			'golden_gate bridge': 'dislike',
			goobi: 'dislike',
			gore: 'dislike',
			goth: 'dislike',
			grabbing: 'dislike',
			grass: 'dislike',
			green_eyes: 'dislike',
			green_hair: 'dislike',
			green_nails: 'dislike',
			green_skin: 'dislike',
			grey_hair: 'dislike',
			growth: 'dislike',
			gtswriter: 'dislike',
			gtsx3d: 'dislike',
			gullivera: 'dislike',
			gun: 'dislike',
			gym: 'dislike',
			hairband: 'dislike',
			hand: 'dislike',
			handheld: 'dislike',
			handjob: 'dislike',
			hando_herudo: 'dislike',
			'hands_on hips': 'dislike',
			hand_crush: 'dislike',
			hanging_on: 'dislike',
			hank88: 'dislike',
			hanna: 'dislike',
			harbor: 'dislike',
			hard_vore: 'dislike',
			harley_quinn: 'dislike',
			hat: 'dislike',
			hatsune_miku: 'dislike',
			headphones: 'dislike',
			heart: 'dislike',
			helicopter: 'dislike',
			helmet: 'dislike',
			herretik: 'dislike',
			hiding: 'dislike',
			highway: 'dislike',
			high_angle: 'dislike',
			high_heels: 'dislike',
			'high_heel boots': 'dislike',
			high_res: 'dislike',
			hinata: 'dislike',
			holding: 'dislike',
			holding_vehicle: 'dislike',
			homestuck: 'dislike',
			honmetgts: 'dislike',
			horn: 'dislike',
			horns: 'dislike',
			horse: 'dislike',
			houses: 'dislike',
			huge_breasts: 'dislike',
			hugging: 'dislike',
			human: 'dislike',
			humiliation: 'dislike',
			ilayhu: 'dislike',
			imminent_crush: 'dislike',
			imminent_vore: 'dislike',
			impending_doom: 'dislike',
			indoors: 'dislike',
			insertion: 'dislike',
			inside: 'dislike',
			inside_mouth: 'dislike',
			inside_pussy: 'dislike',
			inside_stomach: 'dislike',
			inside_view: 'dislike',
			internal: 'dislike',
			internal_view: 'dislike',
			in_shoe: 'dislike',
			in_stomach: 'dislike',
			iodain: 'dislike',
			island: 'dislike',
			jacket: 'dislike',
			jamesmason0: 'dislike',
			japanese_text: 'dislike',
			jar: 'dislike',
			jeans: 'dislike',
			jennifer_lawrence: 'dislike',
			jenni_czech: 'dislike',
			jessi: 'dislike',
			jessica: 'dislike',
			'jessica_& victoria': 'dislike',
			jessica_rabbit: 'dislike',
			'jessi_and vicky': 'dislike',
			jets: 'dislike',
			jetslasher: 'dislike',
			jewelry: 'dislike',
			jimmee: 'dislike',
			jitensha: 'dislike',
			'jj-psychotic': 'dislike',
			jodagee: 'dislike',
			joethevenezuelan: 'dislike',
			johnnyscribe: 'dislike',
			'jora-bora': 'dislike',
			jordan_carver: 'dislike',
			joselitooo23: 'dislike',
			jr: 'dislike',
			julius_zimmerman: 'dislike',
			june: 'dislike',
			jungle: 'dislike',
			kanahebi: 'dislike',
			kanaisei_jitenshasougyou: 'dislike',
			kantai_collection: 'dislike',
			karbo: 'dislike',
			kasumikills: 'dislike',
			'kaytlin-andcie': 'dislike',
			kelly_brook: 'dislike',
			kemo: 'dislike',
			kerneldecoy: 'dislike',
			kibate: 'dislike',
			kimberly: 'dislike',
			kimono: 'dislike',
			'kissa-g': 'dislike',
			kissing: 'dislike',
			kitchen: 'dislike',
			kitsune: 'dislike',
			klnking: 'dislike',
			kneeling: 'dislike',
			knight: 'dislike',
			kolos: 'dislike',
			kononiko: 'dislike',
			kristina: 'dislike',
			lace: 'dislike',
			lactation: 'dislike',
			lake: 'dislike',
			landscape: 'dislike',
			large_breasts: 'dislike',
			las_vegas: 'dislike',
			latex: 'dislike',
			laughing: 'dislike',
			'league_of legends': 'dislike',
			leaning: 'dislike',
			leaning_forward: 'dislike',
			leash: 'dislike',
			leather: 'dislike',
			leg: 'dislike',
			'legend_of zelda': 'dislike',
			leggings: 'dislike',
			legs: 'dislike',
			legs_crossed: 'dislike',
			legs_spread: 'dislike',
			leopard_print: 'dislike',
			lesbians: 'dislike',
			lfcfan: 'dislike',
			licking: 'dislike',
			licking_lips: 'dislike',
			lifting: 'dislike',
			lights: 'dislike',
			'lilipucien\'s_work': 'dislike',
			lineart: 'dislike',
			lingerie: 'dislike',
			link: 'dislike',
			lips: 'dislike',
			lipstick: 'dislike',
			liquidz: 'dislike',
			littlesmall: 'dislike',
			liuti: 'dislike',
			living_room: 'dislike',
			lizard: 'dislike',
			locker_room: 'dislike',
			lollipop420b: 'dislike',
			london: 'dislike',
			long_hair: 'dislike',
			long_nails: 'dislike',
			long_tongue: 'dislike',
			'looking_at tiny': 'dislike',
			'looking_at victim': 'dislike',
			'looking_at victims': 'dislike',
			'looking_at viewer': 'dislike',
			looking_away: 'dislike',
			looking_back: 'dislike',
			looking_down: 'dislike',
			looking_in: 'dislike',
			'looking_into distance': 'dislike',
			looking_up: 'dislike',
			loryelle: 'dislike',
			love: 'dislike',
			lowerrider: 'dislike',
			low_angle: 'dislike',
			luna: 'dislike',
			lying_down: 'dislike',
			macro: 'dislike',
			macross: 'dislike',
			macross_frontier: 'dislike',
			madamemaeve: 'dislike',
			magic: 'dislike',
			magmag: 'dislike',
			maid_uniform: 'dislike',
			makeup: 'dislike',
			male: 'dislike',
			mamabliss: 'dislike',
			manga: 'dislike',
			manicure: 'dislike',
			manzi: 'dislike',
			marcos_snowbell: 'dislike',
			mario: 'dislike',
			marisa_kirisame: 'dislike',
			marvel_comics: 'dislike',
			mask: 'dislike',
			massage: 'dislike',
			massive: 'dislike',
			mass_effect: 'dislike',
			mastasmall: 'dislike',
			masturbation: 'dislike',
			mat: 'dislike',
			mature: 'dislike',
			mawshot: 'dislike',
			'medium_length hair': 'dislike',
			mega: 'dislike',
			mega_giantess: 'dislike',
			mejiro: 'dislike',
			men: 'dislike',
			mermaid: 'dislike',
			mick_78: 'dislike',
			micro: 'dislike',
			micromike: 'dislike',
			midna: 'dislike',
			mike973: 'dislike',
			mikeyboy: 'dislike',
			milf: 'dislike',
			military: 'dislike',
			milk: 'dislike',
			milo_manara: 'dislike',
			mini: 'dislike',
			miniskirt: 'dislike',
			mini_giantess: 'dislike',
			mini_skirt: 'dislike',
			mip100: 'dislike',
			mirror: 'dislike',
			mistress: 'dislike',
			misty: 'dislike',
			miton: 'dislike',
			modeseven: 'dislike',
			molotav: 'dislike',
			monochrome: 'dislike',
			monster: 'dislike',
			monster_girl: 'dislike',
			moon: 'dislike',
			motorcycle: 'dislike',
			mountains: 'dislike',
			mousani: 'dislike',
			mouse: 'dislike',
			mouse_boy: 'dislike',
			mouse_girl: 'dislike',
			mouth: 'dislike',
			mouthplay: 'dislike',
			mouth_open: 'dislike',
			movie: 'dislike',
			mr_luigi: 'dislike',
			msku: 'dislike',
			mspaintgts: 'dislike',
			'mt._lady': 'dislike',
			multiple_giantesses: 'dislike',
			multiple_sizes: 'dislike',
			multiple_victims: 'dislike',
			mundo: 'dislike',
			muscles: 'dislike',
			'my_hero academia': 'dislike',
			'my_little pony': 'dislike',
			naigo: 'dislike',
			nails: 'dislike',
			nail_polish: 'dislike',
			naked_man: 'dislike',
			'nanatsu_no taizai': 'dislike',
			narration: 'dislike',
			naruto: 'dislike',
			nature: 'dislike',
			navel: 'dislike',
			navel_ring: 'dislike',
			necklace: 'dislike',
			'neon_genesis evangelion': 'dislike',
			newschool2626: 'dislike',
			'new_york city': 'dislike',
			night: 'dislike',
			nikemd: 'dislike',
			nikko: 'dislike',
			nintendo: 'dislike',
			nipping: 'dislike',
			nipples: 'dislike',
			nipple_play: 'dislike',
			noboss: 'dislike',
			nose: 'dislike',
			novel: 'dislike',
			no_background: 'dislike',
			nude: 'dislike',
			nurse: 'dislike',
			nylons: 'dislike',
			nyom87: 'dislike',
			ocean: 'dislike',
			ochiko_terada: 'dislike',
			office: 'dislike',
			olivier: 'dislike',
			omc: 'dislike',
			one_piece: 'dislike',
			onlookers: 'dislike',
			on_body: 'dislike',
			on_breast: 'dislike',
			on_finger: 'dislike',
			on_foot: 'dislike',
			on_nipple: 'dislike',
			on_palm: 'dislike',
			on_penis: 'dislike',
			on_shoulder: 'dislike',
			on_toe: 'dislike',
			on_tongue: 'dislike',
			opal: 'dislike',
			openhighhat: 'dislike',
			open_mouth: 'dislike',
			open_toe: 'dislike',
			oral: 'dislike',
			oral_sex: 'dislike',
			orange_hair: 'dislike',
			orgasm: 'dislike',
			outdoors: 'dislike',
			outgrowing_building: 'dislike',
			overwatch: 'dislike',
			pachipachy: 'dislike',
			pacmanri: 'dislike',
			pain: 'dislike',
			painting: 'dislike',
			palislama: 'dislike',
			palm: 'dislike',
			palm_trees: 'dislike',
			pandoza: 'dislike',
			panels: 'dislike',
			panties: 'dislike',
			pants: 'dislike',
			pantyshot: 'dislike',
			panty_entrapment: 'dislike',
			paris: 'dislike',
			park: 'dislike',
			parking_lot: 'dislike',
			parody: 'dislike',
			paws: 'dislike',
			pedestrians: 'dislike',
			pedicure: 'dislike',
			pee: 'dislike',
			pencil_drawing: 'dislike',
			penetration: 'dislike',
			penis: 'dislike',
			pen_paper: 'dislike',
			people: 'dislike',
			peque: 'dislike',
			perspective: 'dislike',
			pet: 'dislike',
			peterparkerlawl: 'dislike',
			phone: 'dislike',
			photograph: 'dislike',
			piercing: 'dislike',
			piercings: 'dislike',
			pigtails: 'dislike',
			pillow: 'dislike',
			pinched: 'dislike',
			pink_eyes: 'dislike',
			pink_hair: 'dislike',
			pink_nails: 'dislike',
			pinned: 'dislike',
			planet: 'dislike',
			platforms: 'dislike',
			playful: 'dislike',
			pogojo: 'dislike',
			pointed_ears: 'dislike',
			pointing: 'dislike',
			'point_of view': 'dislike',
			pokemon: 'dislike',
			poking: 'dislike',
			police: 'dislike',
			ponytail: 'dislike',
			ponytails: 'dislike',
			pool: 'dislike',
			poposan: 'dislike',
			posing: 'dislike',
			pressure: 'dislike',
			preview: 'dislike',
			princess: 'dislike',
			princess_peach: 'dislike',
			princess_zelda: 'dislike',
			'ps3_has no games': 'dislike',
			pubic_hair: 'dislike',
			purple_eyes: 'dislike',
			purple_hair: 'dislike',
			purple_nails: 'dislike',
			purple_skin: 'dislike',
			purse: 'dislike',
			pussy: 'dislike',
			raised_foot: 'dislike',
			rampage: 'dislike',
			ranmaru: 'dislike',
			rape: 'dislike',
			raven: 'dislike',
			ravenravenraven: 'dislike',
			reaching: 'dislike',
			reading: 'dislike',
			redcoffee1: 'dislike',
			reddrop7: 'dislike',
			redfiredog: 'dislike',
			red_eyes: 'dislike',
			red_hair: 'dislike',
			red_lips: 'dislike',
			red_nails: 'dislike',
			red_skin: 'dislike',
			reflection: 'dislike',
			reimu_hakurei: 'dislike',
			related: 'dislike',
			relaxing: 'dislike',
			reptile: 'dislike',
			resort: 'dislike',
			ribbon: 'dislike',
			rings: 'dislike',
			ripped_clothing: 'dislike',
			river: 'dislike',
			road: 'dislike',
			robot: 'dislike',
			rocks: 'dislike',
			rooftop: 'dislike',
			rooftop_view: 'dislike',
			room: 'dislike',
			rubbing: 'dislike',
			rubble: 'dislike',
			ruins: 'dislike',
			running: 'dislike',
			running_away: 'dislike',
			runswithferrets: 'dislike',
			rwby: 'dislike',
			sailor_moon: 'dislike',
			saintxtail: 'dislike',
			sakura: 'dislike',
			saliva: 'dislike',
			sample_image: 'dislike',
			samus_aran: 'dislike',
			sand: 'dislike',
			sandals: 'dislike',
			san_francisco: 'dislike',
			scared: 'dislike',
			school: 'dislike',
			scientist: 'dislike',
			screaming: 'dislike',
			screeeow: 'dislike',
			screen_capture: 'dislike',
			scrotum: 'dislike',
			selena_gomez: 'dislike',
			seo_tatsuya: 'dislike',
			sequence: 'dislike',
			'ser-gts': 'dislike',
			series: 'dislike',
			set: 'dislike',
			seth: 'dislike',
			'seven_deadly sins': 'dislike',
			sex: 'dislike',
			sexy: 'dislike',
			sex_toy: 'dislike',
			shaded: 'dislike',
			shadester: 'dislike',
			shadow: 'dislike',
			sharp_teeth: 'dislike',
			shaved_pussy: 'dislike',
			shaven: 'dislike',
			shazam: 'dislike',
			sheela: 'dislike',
			shimapan: 'dislike',
			'shingeki_no kyojin': 'dislike',
			ships: 'dislike',
			shirt: 'dislike',
			shoes: 'dislike',
			shoes_crush: 'dislike',
			shorts: 'dislike',
			short_hair: 'dislike',
			short_shorts: 'dislike',
			short_skirt: 'dislike',
			shower: 'dislike',
			shrine_maiden: 'dislike',
			shrinking: 'dislike',
			shrink_high: 'dislike',
			shrink_ray: 'dislike',
			shrunken: 'dislike',
			shrunken_character: 'dislike',
			shrunken_city: 'dislike',
			shrunken_man: 'dislike',
			shrunken_men: 'dislike',
			shrunken_people: 'dislike',
			shrunken_person: 'dislike',
			shrunken_woman: 'dislike',
			shrunken_women: 'dislike',
			sidewalk: 'dislike',
			simsda: 'dislike',
			sitting: 'dislike',
			'sitting_on building': 'dislike',
			size_comparison: 'dislike',
			size_difference: 'dislike',
			sjw: 'dislike',
			sketch: 'dislike',
			sketching: 'dislike',
			skimpy_clothing: 'dislike',
			skintight_clothing: 'dislike',
			skirt: 'dislike',
			sky: 'dislike',
			skyscraper: 'dislike',
			skyscrapers: 'dislike',
			slave: 'dislike',
			sleeping: 'dislike',
			small: 'dislike',
			small_breasts: 'dislike',
			small_gestures: 'dislike',
			small_man: 'dislike',
			small_men: 'dislike',
			small_woman: 'dislike',
			smelly: 'dislike',
			smiling: 'dislike',
			smogass: 'dislike',
			smoke: 'dislike',
			smoke_slave: 'dislike',
			smoking: 'dislike',
			smothering: 'dislike',
			smushedboy: 'dislike',
			snake_girl: 'dislike',
			sneakers: 'dislike',
			snow: 'dislike',
			socks: 'dislike',
			sofa: 'dislike',
			soft_vore: 'dislike',
			soldiers: 'dislike',
			sole: 'dislike',
			soles: 'dislike',
			somari: 'dislike',
			'sonic_the hedgehog': 'dislike',
			sorenzer0: 'dislike',
			'source_film maker': 'dislike',
			source_needed: 'dislike',
			space: 'dislike',
			spacecraft: 'dislike',
			spaceship: 'dislike',
			spawngts: 'dislike',
			spokle: 'dislike',
			spoon: 'dislike',
			sports_bra: 'dislike',
			squashing: 'dislike',
			squatting: 'dislike',
			squeezemeflat: 'dislike',
			stadium: 'dislike',
			stairs: 'dislike',
			standing: 'dislike',
			starfire: 'dislike',
			starkadhr: 'dislike',
			stars: 'dislike',
			'statue_of liberty': 'dislike',
			stepped_on: 'dislike',
			stepping: 'dislike',
			steven_universe: 'dislike',
			stockings: 'dislike',
			stomach: 'dislike',
			stomach_acid: 'dislike',
			stomach_view: 'dislike',
			stomping: 'dislike',
			stool: 'dislike',
			story: 'dislike',
			straddling: 'dislike',
			street: 'dislike',
			streets: 'dislike',
			street_fighter: 'dislike',
			street_view: 'dislike',
			stretching: 'dislike',
			strike_witches: 'dislike',
			striped_panties: 'dislike',
			striped_stockings: 'dislike',
			strolling: 'dislike',
			struggling: 'dislike',
			stuck: 'dislike',
			'stuck_to butt': 'dislike',
			'stuck_to foot': 'dislike',
			student: 'dislike',
			suburbs: 'dislike',
			succubus: 'dislike',
			sucking: 'dislike',
			suit: 'dislike',
			sun: 'dislike',
			sunbathing: 'dislike',
			sunglasses: 'dislike',
			sunny: 'dislike',
			sunset: 'dislike',
			supergirl: 'dislike',
			superhero: 'dislike',
			surprised: 'dislike',
			swallowed: 'dislike',
			sweat: 'dislike',
			sweater: 'dislike',
			swimming: 'dislike',
			swimsuit: 'dislike',
			sword: 'dislike',
			't-shirt': 'dislike',
			table: 'dislike',
			tail: 'dislike',
			tan: 'dislike',
			tank: 'dislike',
			taran: 'dislike',
			tastysnack: 'dislike',
			tattoo: 'dislike',
			tattooed: 'dislike',
			taylor_swift: 'dislike',
			tdart: 'dislike',
			teacher: 'dislike',
			teasing: 'dislike',
			technimind: 'dislike',
			teen_titans: 'dislike',
			teeth: 'dislike',
			testicles: 'dislike',
			teston: 'dislike',
			text: 'dislike',
			tgirl: 'dislike',
			thaddeusmcboosh: 'dislike',
			'the_world god only knows': 'dislike',
			thick_thighs: 'dislike',
			thighhighs: 'dislike',
			thighs: 'dislike',
			thigh_highs: 'dislike',
			thong: 'dislike',
			thor66: 'dislike',
			throat: 'dislike',
			throat_bulge: 'dislike',
			throat_view: 'dislike',
			tie: 'dislike',
			'tied_to sex toy': 'dislike',
			tights: 'dislike',
			tinies: 'dislike',
			tiny: 'dislike',
			'tiny-little-lisa': 'dislike',
			tiny_mk: 'dislike',
			titfuck: 'dislike',
			toenails: 'dislike',
			toering: 'dislike',
			toes: 'dislike',
			toe_crush: 'dislike',
			toe_ring: 'dislike',
			toilet: 'dislike',
			toka: 'dislike',
			tolik: 'dislike',
			tongue: 'dislike',
			tontoblackadder: 'dislike',
			top: 'dislike',
			topless: 'dislike',
			torajimaneko: 'dislike',
			torture: 'dislike',
			touching: 'dislike',
			touhou: 'dislike',
			towel: 'dislike',
			tower: 'dislike',
			towering: 'dislike',
			town: 'dislike',
			toy: 'dislike',
			toyogub: 'dislike',
			'to_love ru': 'dislike',
			tracer: 'dislike',
			traffic: 'dislike',
			train: 'dislike',
			trample: 'dislike',
			translate_me: 'dislike',
			trapped: 'dislike',
			trayx: 'dislike',
			tree: 'dislike',
			trees: 'dislike',
			tribal: 'dislike',
			truck: 'dislike',
			twintails: 'dislike',
			twisted_persona: 'dislike',
			t_soni: 'dislike',
			ufo: 'dislike',
			ultra: 'dislike',
			unaware: 'dislike',
			underboob: 'dislike',
			underneath: 'dislike',
			underwater: 'dislike',
			underwear: 'dislike',
			under_foot: 'dislike',
			undressing: 'dislike',
			uniform: 'dislike',
			unknown_artist: 'dislike',
			unknown_manga: 'dislike',
			unwilling: 'dislike',
			upskirt: 'dislike',
			uru: 'dislike',
			utopia: 'dislike',
			uvula: 'dislike',
			vaginal_dryness: 'dislike',
			vehicles: 'dislike',
			vehicle_crush: 'dislike',
			vehicle_insertion: 'dislike',
			vehicle_vore: 'dislike',
			victoria: 'dislike',
			video_game: 'dislike',
			village: 'dislike',
			violence: 'dislike',
			virtual: 'dislike',
			virtual_giantess: 'dislike',
			vivian: 'dislike',
			vocaloid: 'dislike',
			voluptuous: 'dislike',
			vore: 'dislike',
			wading: 'dislike',
			walking: 'dislike',
			watch: 'dislike',
			water: 'dislike',
			waterfall: 'dislike',
			waterfront: 'dislike',
			waves: 'dislike',
			waving: 'dislike',
			wet: 'dislike',
			white_dress: 'dislike',
			white_hair: 'dislike',
			white_panties: 'dislike',
			willing: 'dislike',
			window: 'dislike',
			wine: 'dislike',
			wings: 'dislike',
			winking: 'dislike',
			winzling: 'dislike',
			witch: 'dislike',
			wolf: 'dislike',
			wolf_girl: 'dislike',
			women: 'dislike',
			wonderslug: 'dislike',
			wonder_woman: 'dislike',
			workout: 'dislike',
			'world_of warcraft': 'dislike',
			worship: 'dislike',
			wrestling: 'dislike',
			xanafar: 'dislike',
			xolittleonexo: 'dislike',
			yamumil: 'dislike',
			yellow_eyes: 'dislike',
			yilx: 'dislike',
			zed782: 'dislike',
			zoolp: 'dislike',
			zoom: 'dislike',
			みとん: 'dislike',
			Shimmie: 'dislike',
			Shish: 'dislike'
		};
		const argsIterator = args.entries();
		for (const e of argsIterator) {
			if (isNumeric(Number(e[1]))) {
				var limit = Number(e[1]);
				args.splice(e[0], 1);
			}
			if (aliases.indexOf(e[1]) > -1) {
				site = e[1];
				args.splice(e[0], 1);
			}
		}
		if (!people.people[id]) {
			people.people[id] = {};
			_.save(people);
			people = _.load();
		}
		if (people.people[id]) {
			if (!people.people[id].fetishes) {
				people.people[id].fetishes = {};
				_.save(people);
				people = _.load();
			}
			if (people.people[id].fetishes.Furry == 'like') {
				furry = true;
			}
			if (people.people[id].fetishes.Male == 'like') {
				male = true;
			}
			if (people.people[id].fetishes.Scat == 'like') {
				scat = true;
			}
			if (people.people[id].fetishes.Booru == 'like') {
				scat = true;
				male = true;
				furry = true;
			}
		}
		const fetishes = people.people[id].fetishes;
		const lowerOther = Object.entries(fetishes).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
			map[val[0]] = val[1];
			return map;
		}, {});
		const lowerMain = Object.entries(fetishes2).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
			map[val[0]] = val[1];
			return map;
		}, {});
		const commonDislikes = [];
		for (const val in lowerMain) {
			if (lowerOther[val] && lowerOther[val] === lowerMain[val]) {
				if (lowerMain[val] == 'dislike') {
					commonDislikes.push(val);
				}
			}
		}

		const dislikes = [];
		for (key of commonDislikes) {
			dislikes.push(`-${encodeURIComponent(key.replace(' ', '_'))}`);
		}
		for (const arg of args) {
			tags.push(arg);
		}

		const cleanTags = tags.join(', ');

		if (tags.length > 0) {
			var tag1 = tags[0];
			const tag2 = tags[1];
			const tag3 = tags[2];
			const tag4 = tags[3];
			const tag5 = tags[4];
		}
		if (site == 'gtsbooru' || site == 'giantessbooru' || site == 'gbooru' || site == 'giantessbooru.com') {
			if (dislikes.length > 0) {
				tags = tags.concat(dislikes);
			}
			if (tags.length === 0) {
				var pageToVisit = 'http://giantessbooru.com/post/list';
			} else if (tags.length == 1) {
				var pageToVisit = 'http://giantessbooru.com/post/list/' + tags[0] + '%2C-scat/1';
			} else if (tags.length > 1) {
				var pageToVisit = 'http://giantessbooru.com/post/list/' + tags.join('%2C') + '%2C-scat/1';
			}
			if (scat) {
				pageToVisit = pageToVisit.replace('%2C-scat', '');
			}
			console.log(pageToVisit);
			const j = request.jar();
			const cookie1 = request.cookie('agreed=true');
			const cookie2 = request.cookie(`ShowFurryContent=${furry}`);
			const cookie3 = request.cookie(`ShowMaleContent=${male}`);
			const cookie4 = request.cookie('ShowMQContent=true');
			const cookie5 = request.cookie('ShowLQContent=false');
			j.setCookie(cookie1, pageToVisit);
			j.setCookie(cookie2, pageToVisit);
			j.setCookie(cookie3, pageToVisit);
			j.setCookie(cookie4, pageToVisit);
			j.setCookie(cookie5, pageToVisit);
			request({url: pageToVisit, jar: j}, (error, response, body) => {
				const link_array = [];
				 if (error) {
					 console.log('Error: ' + error);
				 }
				 if (response.statusCode === 200) {
					 // Parse the document body
					 const $ = cheerio.load(body);
					 if (response.request.uri.href.startsWith('http://giantessbooru.com/post/view/') || response.request.uri.href.startsWith('https://giantessbooru.com/post/view/')) { // gtsbooru redirects to the result pic page immediately if only 1 result exists, so we have to handle that specifically
							 link_array.push(response.request.uri.path);
					 } else {
							 const thing = $('.thumb').children();
							 for (child in thing) {
									 const child_thing = thing[child];
									 if (child_thing.type == 'tag') {
								link_array.push(child_thing.attribs.href);
									 } else {
								break;
							}
							 }
					 	}
					 }
					 const maths = Math.floor(Math.random() * link_array.length);
					 const pageToVisit = 'http://giantessbooru.com' + link_array[maths];
					 if (link_array.length === 0) {
					 Bot.createMessage(m.channel.id, 'No image found for: **' + tags.join(', ') + '**');
					 return;
				 	 }
					 const j = request.jar();
					 const cookie1 = request.cookie('agreed=true');
					 const cookie2 = request.cookie('ShowFurryContent=true');
					 const cookie3 = request.cookie('ShowMaleContent=true');
					 j.setCookie(cookie1, pageToVisit);
					 j.setCookie(cookie2, pageToVisit);
					 j.setCookie(cookie3, pageToVisit);
				request({url: pageToVisit, jar: j}, (error, response, body) => {
					if (response.statusCode === 200) {
						// Parse the document body
						const $ = cheerio.load(body);
						const imgURL = $('#main_image')[0].attribs.src;
						imageURL.push('http://giantessbooru.com' + imgURL.toLowerCase());
					}
					if (imageURL.length < 2) {
							 const random = Math.floor(Math.random() * 420);
							 const number = maths + 1;
								 const data = {
									 content: 'Results on **' + site + '**',
									 embed: {
										 color: 0xA260F6,
										 footer: {
											 icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace('.jpg', '.webp?size=1024'),
											 text: 'Searched by: ' + name + '. Image ' + number + ' of ' + link_array.length
										 },
										 image: {
											 url: imageURL.toString()
										 },
										 author: {
											 name: cleanTags,
											 url: 'http://giantessbooru.com' + response.request.uri.path
										 }
									 }
								 };
								 Bot.createMessage(m.channel.id, data);
								 return;
					}
					if (imageURL.length > 1) {
								 const data = {
									 content: 'Results on **' + site + '**',
									 embed: {
										 color: 0xA260F6,
										 footer: {
											 icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace('.jpg', '.webp?size=1024'),
											 text: 'Searched by: ' + name + '. Image ' + maths + ' of ' + link_array.length
										 },
										 image: {
											 url: imageURL[0].toString()
										 },
										 author: {
											 name: cleanTags,
											 url: 'http://giantessbooru.com' + response.request.uri.path
										 }
									 }
								 };
								 Bot.createMessage(m.channel.id, data);
								 imageURL.splice(0, 1);
								 const iterator = imageURL.entries();
								 for (const e of iterator) {
									 Bot.createMessage(m.channel.id, {
											 embed: {
													 color: 0xA260F6,
													 image: {
														 url: e[1]
													 }
											 }
									 });
								 }
					}
				});
			});
			return;
		}

		if (site == 'danbooru' || site == 'dan' || site == 'db' && tags.length > 2) {
			Bot.createMessage(m.channel.id, 'Danbooru doesnt support searching with multiple tags this way. Only the first tag was used');
		}

		if (site == 'danbooru' || site == 'dan' || site == 'db') {
	    booru.search(site, [tag1], {limit, random: true})
	    .then(booru.commonfy)
	    .then(images => {
	      // Log the direct link to each image
	      for (const image of images) {
	        imageURL.push(image.common.file_url);
						Bot.createMessage(m.channel.id, 'Result for: **' + tag1 + (', ') + '** on ' + site + '\n' + imageURL);
	      }
	    })
	    .catch(err => {
	      if (err.name === 'BooruError') {
	        // It's a custom error thrown by the package
						if (err.message == 'You didn\'t give any images') {
							Bot.createMessage(m.channel.id, 'No images were found for: ' + tag1);
							return;
						}
	        console.log(err.message);
						Bot.createMessage(m.channel.id, err.message);
	      } else {
	        // This means I messed up. Whoops.
	        console.log(err);
						Bot.createMessage(m.channel.id, 'An unknown error has occured');
	      }
	    });
	    return;
	  }

		if (tags.length < 0) {
			Bot.createMessage(m.channel.id, `Please input your search tags and/or booru. A list is availible by doing \`\`${prefix}booru list\`\``);
			return;
		}
		booru.search(site, tags.join(' | ').split(' | '), {limit, random: true})
			.then(booru.commonfy)
			.then(images => {
				// Log the direct link to each image
				for (const image of images) {
					imageURL.push(image.common.file_url);
				}

				if (imageURL.length == 1) {
					const data = {
						content: 'Results on **' + site + '**',
						embed: {
							color: 0xA260F6,
							footer: {
								icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace('.jpg', '.webp?size=1024'),
								text: 'Searched by: ' + name
							},
							image: {
								url: imageURL.toString()
							},
							author: {
								name: cleanTags,
								url: imageURL.toString()
							}
						}
					};

					Bot.createMessage(m.channel.id, data);
				} else if (imageURL.length > 1) {
					const data = {
						content: 'Results on **' + site + '**',
						embed: {
							color: 0xA260F6,
							footer: {
								icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace('.jpg', '.webp?size=1024'),
								text: 'Searched by: ' + name
							},
							image: {
								url: imageURL[0].toString()
							},
							author: {
								name: cleanTags,
								url: imageURL[0].toString()
							}
						}
					};
					Bot.createMessage(m.channel.id, data);
					imageURL.splice(0, 1);
					const iterator = imageURL.entries();

					for (const e of iterator) {
						Bot.createMessage(m.channel.id, {
							embed: {
								color: 0xA260F6,
								image: {
									url: e[1]
								}
							}
						});
					}
				}
			})
			.catch(err => {
				if (err.name === 'BooruError') {
					// It's a custom error thrown by the package
					if (err.message == 'You didn\'t give any images') {
						Bot.createMessage(m.channel.id, 'No images were found for: **' + tag1 + '**');
						return;
					}
					console.log(err.message);
					Bot.createMessage(m.channel.id, err.message);
				} else {
					// This means I messed up. Whoops.
					console.log(err);
					Bot.createMessage(m.channel.id, 'An unknown error has occured, please try again later');
				}
			});
	},
	help: `Search Boorus for images. \`!booru list\` for list`
};
