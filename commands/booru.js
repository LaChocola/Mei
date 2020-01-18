"use strict";

const booru = require("booru");
const request = require("request-promise").defaults({ jar: true });
const cheerio = require("cheerio");

const peopledb = require("../people");

module.exports = {
	main: async function (Bot, m, args, prefix) {
		var people = await peopledb.load();

		function isNumeric(num) {
			return !isNaN(Number(num));
		}
		if (m.author.id === "187368906493526017") {
			return;
		}
		if (!m.channel.nsfw) {
			Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
			return;
		}
		var name = m.author.nick || m.author.username;
		if (m.content.toLowerCase() === `${prefix}booru list`) {
			Bot.createMessage(m.channel.id, {
				content: "",
				embed: {
					color: 0xA260F6,
					title: "Total Boorus Available: 16\nDefault Booru: giantessbooru.com",
					description: "**Other Available Boorus | Aliases:**\n***giantessbooru*** | gtsbooru, gbooru\n***e621*** | e6, e621, e9, e926\n***hypnohub*** | hh, hypno\n***danbooru*** | db\n***konachan*** | kc, konan\n***yande.re*** | yd, yand\n***gelbooru*** | gb, gel\n***rule34*** | r34\n***safebooru*** | sb\n***tbib*** | tb, tbib\n***xbooru*** | xb\n***derpibooru*** | dp, derpi\n***furrybooru*** | fb \n***realbooru*** | rb"
				}
			});
			return;
		}
		args = m.cleanContent.toLowerCase().replace(`${prefix}booru`, "").trim().split(", ");

		// TODO: Move this into a separate `getArgs()` function
        /* Sets:
         *  limit
         *  site
         *  tags
         */
		const aliases = [
			"e6",
			"e621",
			"e9",
			"e926",
			"hh",
			"hypo",
			"hypohub",
			"dan",
			"db",
			"danbooru",
			"kc",
			"konan",
			"knet",
			"yd",
			"yand",
			"gb",
			"gel",
			"gelbooru",
			"r34",
			"rule34",
			"sb",
			"safebooru",
			"tb",
			"tbib",
			"xb",
			"xbooru",
			"pa",
			"paheal",
			"dp",
			"derpi",
			"derpibooru",
			"giantessbooru",
			"gtsbooru",
			"gbooru",
			"giantessbooru.com",
			"fb",
			"furrybooru",
			"rb",
			"realbooru"
		];

		var limit = null;
		var site = null;

		var tags = args.filter(function (arg) {
			if (arg) {
				if (limit === null && isNumeric(arg)) {
					limit = Math.floor(Number(arg));
					return false;
				}

				if (!site && aliases.includes(arg)) {
					site = arg;
					return false;
				}

				return true;
			}
		});
		if (limit !== null && (limit < 1 || limit > 10)) {
			Bot.createMessage(m.channel.id, "Please provide a limit between 1 and 10.").then((msg) => {
				return setTimeout(function () {
					Bot.deleteMessage(m.channel.id, m.id, "Timeout");
					Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
				}, 10000);
			});
			return;
		}
		limit = limit || 1;
		site = site || "giantessbooru.com";
		if (tags.length < 1) {
			tags.push("giantess");
			Bot.createMessage(m.channel.id, `No search tags were added. Defaulting to search for \`giantess\` on site: \`${site}\``);
		}
		var cleanTags = tags.join(", ");

		if (site === "gtsbooru" || site === "giantessbooru" || site === "gbooru" || site === "giantessbooru.com") {
			// TODO: Move this code to a separate `getFetishes()` function
			/*
			* Sets:
			*  furry
			*  male
			*  scat
			*  dislikes
			*/
			var furry = false;
			var male = false;
			var scat = false;
			var dislikes = [];

			var id = m.author.id;
			if (!people.people[id]) {
				people.people[id] = {};
				await peopledb.save(people);
			}
			if (!people.people[id].fetishes) {
				people.people[id].fetishes = {};
				await peopledb.save(people);
			}
			if (people.people[id].fetishes.Furry === "like") {
				furry = true;
			}
			if (people.people[id].fetishes.Male === "like") {
				male = true;
			}
			if (people.people[id].fetishes.Scat === "like") {
				scat = true;
			}
			if (people.people[id].fetishes.Booru === "like") {
				scat = true;
				male = true;
				furry = true;
			}
			const fetishes2 = {
				"a-i-k-art": "dislike",
				"aaabbbzzz": "dislike",
				"above view": "dislike",
				"abs": "dislike",
				"accasbel": "dislike",
				"adeline": "dislike",
				"adrianna daniels": "dislike",
				"advertisement": "dislike",
				"aerial view": "dislike",
				"afraid": "dislike",
				"aircraft carrier": "dislike",
				"airplane": "dislike",
				"airport": "dislike",
				"airraid": "dislike",
				"ai tanaka": "dislike",
				"alice in wonderland": "dislike",
				"alien": "dislike",
				"aliens": "dislike",
				"aliessa": "dislike",
				"amazon": "dislike",
				"amgipi": "dislike",
				"anal": "dislike",
				"anal insertion": "dislike",
				"angel": "dislike",
				"angelgts": "dislike",
				"angle\"s playground": "dislike",
				"angle\"s playground chapter 2": "dislike",
				"angry": "dislike",
				"animation": "dislike",
				"anime": "dislike",
				"ankles": "dislike",
				"ankle bracelet": "dislike",
				"anna": "dislike",
				"anthro": "dislike",
				"apeiron-macro": "dislike",
				"armor": "dislike",
				"armpits": "dislike",
				"aroused": "dislike",
				"ascension": "dislike",
				"ashkiiwolf": "dislike",
				"asian": "dislike",
				"athletic": "dislike",
				"attack of the 50 foot woman": "dislike",
				"attack on titan": "dislike",
				"ayami6": "dislike",
				"back": "dislike",
				"bakugeki no g": "dislike",
				"balcony": "dislike",
				"bald": "dislike",
				"barefoot": "dislike",
				"bare midriff": "dislike",
				"barn": "dislike",
				"basketball": "dislike",
				"bath": "dislike",
				"bathroom": "dislike",
				"batman": "dislike",
				"bay": "dislike",
				"bbw": "dislike",
				"beach": "dislike",
				"beach goers": "dislike",
				"bed": "dislike",
				"bedroom": "dislike",
				"behind view": "dislike",
				"belly": "dislike",
				"belt": "dislike",
				"bench": "dislike",
				"bending over": "dislike",
				"beregous": "dislike",
				"between breasts": "dislike",
				"between buildings": "dislike",
				"between buttcheeks": "dislike",
				"between feet": "dislike",
				"between fingers": "dislike",
				"between legs": "dislike",
				"between toes": "dislike",
				"big butt": "dislike",
				"bikini": "dislike",
				"bikini bottom": "dislike",
				"bikini top": "dislike",
				"bikuta": "dislike",
				"birds": "dislike",
				"black dress": "dislike",
				"black hair": "dislike",
				"black nails": "dislike",
				"bleach": "dislike",
				"blonde": "dislike",
				"blood": "dislike",
				"blowjob": "dislike",
				"blue eyes": "dislike",
				"blue hair": "dislike",
				"blue nails": "dislike",
				"blue skin": "dislike",
				"blushing": "dislike",
				"boats": "dislike",
				"bobbob": "dislike",
				"body exploration": "dislike",
				"bondage": "dislike",
				"book": "dislike",
				"boomgts": "dislike",
				"boot": "dislike",
				"boots": "dislike",
				"bottle": "dislike",
				"bottomless": "dislike",
				"bow": "dislike",
				"bowl": "dislike",
				"bra": "dislike",
				"bracelet": "dislike",
				"braid": "dislike",
				"breasts": "dislike",
				"breast crush": "dislike",
				"breast expansion": "dislike",
				"breast play": "dislike",
				"bridge": "dislike",
				"brown eyes": "dislike",
				"brunette": "dislike",
				"bruzzo": "dislike",
				"bugunderherfeet": "dislike",
				"buildings": "dislike",
				"building sex": "dislike",
				"bulge": "dislike",
				"bunny": "dislike",
				"bunny girl": "dislike",
				"burj khalifa": "dislike",
				"burp": "dislike",
				"bus": "dislike",
				"business woman": "dislike",
				"butre3004": "dislike",
				"butt": "dislike",
				"buttman": "dislike",
				"butt crush": "dislike",
				"bystanders": "dislike",
				"cage": "dislike",
				"camel toe": "dislike",
				"camera": "dislike",
				"canadian giantess": "dislike",
				"canine": "dislike",
				"cape": "dislike",
				"captain rand": "dislike",
				"captions": "dislike",
				"captured": "dislike",
				"carg": "dislike",
				"carpet": "dislike",
				"cars": "dislike",
				"cartoon": "dislike",
				"castle": "dislike",
				"cat": "dislike",
				"cat ears": "dislike",
				"cat girl": "dislike",
				"caught": "dislike",
				"celebrity": "dislike",
				"cellphone": "dislike",
				"censored": "dislike",
				"cerberus": "dislike",
				"chains": "dislike",
				"chair": "dislike",
				"chapter 3": "dislike",
				"chapter 4": "dislike",
				"cheerleader": "dislike",
				"chibichan": "dislike",
				"chicago": "dislike",
				"chief": "dislike",
				"chinese": "dislike",
				"choker": "dislike",
				"chopsticks": "dislike",
				"christmas": "dislike",
				"cigarette": "dislike",
				"city": "dislike",
				"city lights": "dislike",
				"classroom": "dislike",
				"claws": "dislike",
				"cleavage": "dislike",
				"cliff": "dislike",
				"climbing": "dislike",
				"clit": "dislike",
				"closed eyes": "dislike",
				"close up": "dislike",
				"clothed": "dislike",
				"clothing": "dislike",
				"clouds": "dislike",
				"cock vore": "dislike",
				"collage": "dislike",
				"collar": "dislike",
				"color": "dislike",
				"comic": "dislike",
				"commission": "dislike",
				"computer": "dislike",
				"converse": "dislike",
				"corset": "dislike",
				"cosmic giantess": "dislike",
				"cosplay": "dislike",
				"costume": "dislike",
				"countryside": "dislike",
				"couple": "dislike",
				"covering breasts": "dislike",
				"cover page": "dislike",
				"cracked pavement": "dislike",
				"cramped": "dislike",
				"crawling": "dislike",
				"crisis": "dislike",
				"crlvr": "dislike",
				"crotch": "dislike",
				"crouching": "dislike",
				"crowds": "dislike",
				"crown": "dislike",
				"cruel": "dislike",
				"cruise ship": "dislike",
				"crush": "dislike",
				"crushed car": "dislike",
				"crying": "dislike",
				"cum": "dislike",
				"curly hair": "dislike",
				"curvy": "dislike",
				"cutaway": "dislike",
				"cysh aizen": "dislike",
				"d.va": "dislike",
				"dancing": "dislike",
				"dangle": "dislike",
				"darkangle989": "dislike",
				"dark skin": "dislike",
				"dc comics": "dislike",
				"death": "dislike",
				"debris": "dislike",
				"demon": "dislike",
				"demoness": "dislike",
				"denise milani": "dislike",
				"desert": "dislike",
				"desk": "dislike",
				"destruction": "dislike",
				"dialogue": "dislike",
				"digestion": "dislike",
				"digital render": "dislike",
				"dinner-kun": "dislike",
				"dinosaur": "dislike",
				"dirty": "dislike",
				"dirty soles": "dislike",
				"disney": "dislike",
				"docop": "dislike",
				"dofus59": "dislike",
				"dog": "dislike",
				"domination": "dislike",
				"dominatrix": "dislike",
				"downward angle": "dislike",
				"dragon": "dislike",
				"dragoness": "dislike",
				"dragonesslife": "dislike",
				"dragon ball": "dislike",
				"drawing": "dislike",
				"drawing collage": "dislike",
				"drcreep": "dislike",
				"dress": "dislike",
				"drink": "dislike",
				"drinking": "dislike",
				"dripping": "dislike",
				"dropped": "dislike",
				"ducky": "dislike",
				"dust": "dislike",
				"e10": "dislike",
				"earrings": "dislike",
				"earth": "dislike",
				"eating": "dislike",
				"eiffel tower": "dislike",
				"elf": "dislike",
				"elizabeth": "dislike",
				"elsa": "dislike",
				"embarrassed": "dislike",
				"embrace": "dislike",
				"emi": "dislike",
				"emma": "dislike",
				"emma watson": "dislike",
				"endlessrain0110": "dislike",
				"english": "dislike",
				"entrapment": "dislike",
				"ethan64": "dislike",
				"etz": "dislike",
				"eugen": "dislike",
				"explosion": "dislike",
				"eyes": "dislike",
				"eyes closed": "dislike",
				"face": "dislike",
				"facesitting": "dislike",
				"fairy": "dislike",
				"fairy tail": "dislike",
				"falling": "dislike",
				"fanart": "dislike",
				"fangs": "dislike",
				"fantasy": "dislike",
				"fart": "dislike",
				"fater": "dislike",
				"feet": "dislike",
				"felarya": "dislike",
				"female": "dislike",
				"female domination": "dislike",
				"fighting": "dislike",
				"final fantasy": "dislike",
				"finger": "dislike",
				"fingers": "dislike",
				"finger crush": "dislike",
				"fire": "dislike",
				"fishnets": "dislike",
				"fist": "dislike",
				"flagg3d": "dislike",
				"flexing": "dislike",
				"flip flops": "dislike",
				"floor": "dislike",
				"flowers": "dislike",
				"flying": "dislike",
				"fog": "dislike",
				"food": "dislike",
				"fooooly": "dislike",
				"foot crush": "dislike",
				"foot play": "dislike",
				"foot pov": "dislike",
				"foot print": "dislike",
				"foot slave": "dislike",
				"foot worship": "dislike",
				"foreign text": "dislike",
				"forest": "dislike",
				"fox": "dislike",
				"fox ears": "dislike",
				"fox girl": "dislike",
				"freckles": "dislike",
				"from below": "dislike",
				"frozen": "dislike",
				"funny": "dislike",
				"furry": "dislike",
				"futanari": "dislike",
				"game": "dislike",
				"garcia accasbel": "dislike",
				"gentle": "dislike",
				"gestures": "dislike",
				"giant": "dislike",
				"giantess": "dislike",
				"giantess-erodreams2": "dislike",
				"giantessbuster209": "dislike",
				"giantesscity": "dislike",
				"giantesses": "dislike",
				"giantessfan": "dislike",
				"giantessstudios101": "dislike",
				"giantess feet": "dislike",
				"giantess katelyn": "dislike",
				"giantess lover45": "dislike",
				"giantess night": "dislike",
				"giantwaifus": "dislike",
				"giant cock": "dislike",
				"giga": "dislike",
				"giganta": "dislike",
				"ginger": "dislike",
				"ginormica": "dislike",
				"girlfriend": "dislike",
				"giulio 10": "dislike",
				"glass": "dislike",
				"glasses": "dislike",
				"gloves": "dislike",
				"glowing eyes": "dislike",
				"gmod": "dislike",
				"goddess": "dislike",
				"goggles": "dislike",
				"goingdown": "dislike",
				"golden eyes": "dislike",
				"golden gate bridge": "dislike",
				"goobi": "dislike",
				"gore": "dislike",
				"goth": "dislike",
				"grabbing": "dislike",
				"grass": "dislike",
				"green eyes": "dislike",
				"green hair": "dislike",
				"green skin": "dislike",
				"grey hair": "dislike",
				"growth": "dislike",
				"gtslust": "dislike",
				"gtstwist": "dislike",
				"gtsx3d": "dislike",
				"gullivera": "dislike",
				"gun": "dislike",
				"gym": "dislike",
				"hairband": "dislike",
				"hand": "dislike",
				"handheld": "dislike",
				"handjob": "dislike",
				"hando herudo": "dislike",
				"hands on hips": "dislike",
				"hand crush": "dislike",
				"hanging on": "dislike",
				"hank88": "dislike",
				"hanna": "dislike",
				"harbor": "dislike",
				"hard vore": "dislike",
				"harley quinn": "dislike",
				"hat": "dislike",
				"heart": "dislike",
				"heel": "dislike",
				"helicopter": "dislike",
				"herretik": "dislike",
				"hiding": "dislike",
				"highway": "dislike",
				"high angle": "dislike",
				"high heels": "dislike",
				"high heel boots": "dislike",
				"high res": "dislike",
				"hinata": "dislike",
				"holding": "dislike",
				"holding vehicle": "dislike",
				"homestuck": "dislike",
				"honmetgts": "dislike",
				"horn": "dislike",
				"horns": "dislike",
				"horse": "dislike",
				"houses": "dislike",
				"huge breasts": "dislike",
				"hugging": "dislike",
				"human": "dislike",
				"humiliation": "dislike",
				"ilayhu": "dislike",
				"imminent crush": "dislike",
				"imminent vore": "dislike",
				"impending doom": "dislike",
				"implied vore": "dislike",
				"indoors": "dislike",
				"innocent-owl": "dislike",
				"insertion": "dislike",
				"inside": "dislike",
				"inside mouth": "dislike",
				"inside pussy": "dislike",
				"inside stomach": "dislike",
				"inside view": "dislike",
				"internal": "dislike",
				"internal view": "dislike",
				"in shoe": "dislike",
				"in stomach": "dislike",
				"island": "dislike",
				"jacket": "dislike",
				"jamesmason0": "dislike",
				"japanese text": "dislike",
				"jar": "dislike",
				"jeans": "dislike",
				"jennifer lawrence": "dislike",
				"jenni czech": "dislike",
				"jessi": "dislike",
				"jessica": "dislike",
				"jessica & victoria": "dislike",
				"jessica rabbit": "dislike",
				"jessi and vicky": "dislike",
				"jets": "dislike",
				"jetslasher": "dislike",
				"jewelry": "dislike",
				"jimmee": "dislike",
				"jitensha": "dislike",
				"jj-psychotic": "dislike",
				"joethevenezuelan": "dislike",
				"johnnyscribe": "dislike",
				"jora-bora": "dislike",
				"jordan carver": "dislike",
				"joselitooo23": "dislike",
				"jr": "dislike",
				"julius zimmerman": "dislike",
				"june": "dislike",
				"jungle": "dislike",
				"kanaisei jitenshasougyou": "dislike",
				"kantai collection": "dislike",
				"karbo": "dislike",
				"kasumikills": "dislike",
				"kaytlin-andcie": "dislike",
				"kelly brook": "dislike",
				"kemo": "dislike",
				"kerneldecoy": "dislike",
				"kibate": "dislike",
				"kimberly": "dislike",
				"kimono": "dislike",
				"kissa-g": "dislike",
				"kissing": "dislike",
				"kitchen": "dislike",
				"kitsune": "dislike",
				"klnking": "dislike",
				"kneeling": "dislike",
				"knight": "dislike",
				"kolos": "dislike",
				"kononiko": "dislike",
				"kristina": "dislike",
				"kyojingirls": "dislike",
				"labia": "dislike",
				"lace": "dislike",
				"lactation": "dislike",
				"lake": "dislike",
				"landscape": "dislike",
				"large breasts": "dislike",
				"las vegas": "dislike",
				"latex": "dislike",
				"laughing": "dislike",
				"league of legends": "dislike",
				"leaning": "dislike",
				"leaning forward": "dislike",
				"leash": "dislike",
				"leather": "dislike",
				"leather clothing": "dislike",
				"leg": "dislike",
				"legend of zelda": "dislike",
				"leggings": "dislike",
				"legs": "dislike",
				"legs crossed": "dislike",
				"legs spread": "dislike",
				"leopard print": "dislike",
				"lesbians": "dislike",
				"lfcfan": "dislike",
				"licking": "dislike",
				"licking lips": "dislike",
				"lifting": "dislike",
				"lightning": "dislike",
				"lights": "dislike",
				"lilipucien": "dislike",
				"lineart": "dislike",
				"lingerie": "dislike",
				"link": "dislike",
				"lips": "dislike",
				"lipstick": "dislike",
				"liquidz": "dislike",
				"littlesmall": "dislike",
				"liuti": "dislike",
				"living room": "dislike",
				"lizard": "dislike",
				"locker room": "dislike",
				"london": "dislike",
				"long hair": "dislike",
				"long nails": "dislike",
				"long tongue": "dislike",
				"looking at tiny": "dislike",
				"looking at victim": "dislike",
				"looking at victims": "dislike",
				"looking at viewer": "dislike",
				"looking away": "dislike",
				"looking back": "dislike",
				"looking down": "dislike",
				"looking in": "dislike",
				"looking into distance": "dislike",
				"looking up": "dislike",
				"loryelle": "dislike",
				"love": "dislike",
				"lowerrider": "dislike",
				"low angle": "dislike",
				"luna": "dislike",
				"lying down": "dislike",
				"macro": "dislike",
				"macross": "dislike",
				"madamemaeve": "dislike",
				"magic": "dislike",
				"magmag": "dislike",
				"maid uniform": "dislike",
				"makeup": "dislike",
				"male": "dislike",
				"mamabliss": "dislike",
				"manga": "dislike",
				"manicure": "dislike",
				"manuel": "dislike",
				"marcos snowbell": "dislike",
				"mario": "dislike",
				"marvel comics": "dislike",
				"mask": "dislike",
				"massage": "dislike",
				"massive": "dislike",
				"mass effect": "dislike",
				"mastasmall": "dislike",
				"masturbation": "dislike",
				"mat": "dislike",
				"mature": "dislike",
				"mawshot": "dislike",
				"medium length hair": "dislike",
				"mega": "dislike",
				"mejiro": "dislike",
				"men": "dislike",
				"mermaid": "dislike",
				"mick 78": "dislike",
				"micro": "dislike",
				"micromike": "dislike",
				"midna": "dislike",
				"mike973": "dislike",
				"mikeyboy": "dislike",
				"milf": "dislike",
				"military": "dislike",
				"milk": "dislike",
				"milo manara": "dislike",
				"mini": "dislike",
				"miniskirt": "dislike",
				"mini giantess": "dislike",
				"mini skirt": "dislike",
				"mip100": "dislike",
				"mirror": "dislike",
				"mistress": "dislike",
				"miton": "dislike",
				"modeseven": "dislike",
				"molotav": "dislike",
				"monochrome": "dislike",
				"monster": "dislike",
				"monster girl": "dislike",
				"moon": "dislike",
				"motorcycle": "dislike",
				"mountains": "dislike",
				"mousani": "dislike",
				"mouse": "dislike",
				"mouse boy": "dislike",
				"mouse girl": "dislike",
				"mouth": "dislike",
				"mouthplay": "dislike",
				"mouth open": "dislike",
				"movie": "dislike",
				"mr luigi": "dislike",
				"msku": "dislike",
				"mspaintgts": "dislike",
				"mt. lady": "dislike",
				"multiple giantesses": "dislike",
				"multiple sizes": "dislike",
				"multiple victims": "dislike",
				"mundo": "dislike",
				"muscles": "dislike",
				"my hero academia": "dislike",
				"my little pony": "dislike",
				"naigo": "dislike",
				"nails": "dislike",
				"nail polish": "dislike",
				"naked man": "dislike",
				"nanatsu no taizai": "dislike",
				"narration": "dislike",
				"naruto": "dislike",
				"nature": "dislike",
				"navel": "dislike",
				"navel ring": "dislike",
				"necklace": "dislike",
				"neon genesis evangelion": "dislike",
				"newschool2626": "dislike",
				"new york city": "dislike",
				"night": "dislike",
				"nightie": "dislike",
				"nikemd": "dislike",
				"nikko": "dislike",
				"nintendo": "dislike",
				"nipping": "dislike",
				"nipples": "dislike",
				"nipple play": "dislike",
				"noboss": "dislike",
				"nose": "dislike",
				"novel": "dislike",
				"no background": "dislike",
				"nude": "dislike",
				"nurse": "dislike",
				"nylons": "dislike",
				"nyom87": "dislike",
				"ocean": "dislike",
				"ochiko terada": "dislike",
				"office": "dislike",
				"olivier": "dislike",
				"omc": "dislike",
				"one piece": "dislike",
				"onlooker": "dislike",
				"onlookers": "dislike",
				"on body": "dislike",
				"on breast": "dislike",
				"on finger": "dislike",
				"on foot": "dislike",
				"on nipple": "dislike",
				"on palm": "dislike",
				"on penis": "dislike",
				"on shoulder": "dislike",
				"on sole": "dislike",
				"on toe": "dislike",
				"on tongue": "dislike",
				"opal": "dislike",
				"openhighhat": "dislike",
				"open mouth": "dislike",
				"open toe": "dislike",
				"oral": "dislike",
				"oral sex": "dislike",
				"orange hair": "dislike",
				"orgasm": "dislike",
				"outdoors": "dislike",
				"outgrowing building": "dislike",
				"overwatch": "dislike",
				"pacmanri": "dislike",
				"pain": "dislike",
				"painting": "dislike",
				"palislama": "dislike",
				"palm": "dislike",
				"palm trees": "dislike",
				"pandoza": "dislike",
				"panels": "dislike",
				"panties": "dislike",
				"pants": "dislike",
				"pantyshot": "dislike",
				"panty entrapment": "dislike",
				"papayoya": "dislike",
				"paris": "dislike",
				"park": "dislike",
				"parking lot": "dislike",
				"parody": "dislike",
				"paws": "dislike",
				"pedestrians": "dislike",
				"pedicure": "dislike",
				"pee": "dislike",
				"pencil drawing": "dislike",
				"penetration": "dislike",
				"penis": "dislike",
				"pen paper": "dislike",
				"people": "dislike",
				"peque": "dislike",
				"perspective": "dislike",
				"pet": "dislike",
				"peterparkerlawl": "dislike",
				"phone": "dislike",
				"photograph": "dislike",
				"piercing": "dislike",
				"piercings": "dislike",
				"pigtails": "dislike",
				"pillow": "dislike",
				"pinched": "dislike",
				"pink eyes": "dislike",
				"pink hair": "dislike",
				"pink nails": "dislike",
				"pinned": "dislike",
				"planet": "dislike",
				"platforms": "dislike",
				"playful": "dislike",
				"pogojo": "dislike",
				"pointed ears": "dislike",
				"pointing": "dislike",
				"point of view": "dislike",
				"pokemon": "dislike",
				"poking": "dislike",
				"police": "dislike",
				"ponytail": "dislike",
				"ponytails": "dislike",
				"pool": "dislike",
				"posing": "dislike",
				"pressure": "dislike",
				"preview": "dislike",
				"princess": "dislike",
				"princess peach": "dislike",
				"princess zelda": "dislike",
				"ps3 has no games": "dislike",
				"pubic hair": "dislike",
				"purple eyes": "dislike",
				"purple hair": "dislike",
				"purple nails": "dislike",
				"purple skin": "dislike",
				"purse": "dislike",
				"pushing": "dislike",
				"pussy": "dislike",
				"raised foot": "dislike",
				"rampage": "dislike",
				"ranmaru": "dislike",
				"ravenravenraven": "dislike",
				"reaching": "dislike",
				"reading": "dislike",
				"redcoffee1": "dislike",
				"reddrop7": "dislike",
				"redfiredog": "dislike",
				"red eyes": "dislike",
				"red hair": "dislike",
				"red lips": "dislike",
				"red nails": "dislike",
				"red skin": "dislike",
				"reflection": "dislike",
				"related": "dislike",
				"relaxing": "dislike",
				"reptile": "dislike",
				"resort": "dislike",
				"rings": "dislike",
				"ripped clothing": "dislike",
				"river": "dislike",
				"road": "dislike",
				"robot": "dislike",
				"rocks": "dislike",
				"rooftop": "dislike",
				"rooftop view": "dislike",
				"room": "dislike",
				"rubbing": "dislike",
				"rubble": "dislike",
				"ruins": "dislike",
				"running": "dislike",
				"running away": "dislike",
				"runswithferrets": "dislike",
				"rwby": "dislike",
				"saintxtail": "dislike",
				"sakura": "dislike",
				"saliva": "dislike",
				"sample image": "dislike",
				"samus aran": "dislike",
				"sand": "dislike",
				"sandals": "dislike",
				"san francisco": "dislike",
				"scared": "dislike",
				"school": "dislike",
				"scientist": "dislike",
				"screaming": "dislike",
				"screeeow": "dislike",
				"screen capture": "dislike",
				"scrotum": "dislike",
				"selena gomez": "dislike",
				"selfie": "dislike",
				"seo tatsuya": "dislike",
				"sequence": "dislike",
				"ser-gts": "dislike",
				"series": "dislike",
				"set": "dislike",
				"seth": "dislike",
				"seven deadly sins": "dislike",
				"sex": "dislike",
				"sexy": "dislike",
				"sex toy": "dislike",
				"sfxhh3": "dislike",
				"shadester": "dislike",
				"shadow": "dislike",
				"sharp teeth": "dislike",
				"shaved pussy": "dislike",
				"shaven": "dislike",
				"shazam": "dislike",
				"sheela": "dislike",
				"shimapan": "dislike",
				"ships": "dislike",
				"shirt": "dislike",
				"shoes": "dislike",
				"shoe crush": "dislike",
				"shorts": "dislike",
				"short hair": "dislike",
				"short shorts": "dislike",
				"short skirt": "dislike",
				"shower": "dislike",
				"shrine maiden": "dislike",
				"shrinking": "dislike",
				"shrink ray": "dislike",
				"shrunken": "dislike",
				"shrunken character": "dislike",
				"shrunken city": "dislike",
				"shrunken man": "dislike",
				"shrunken men": "dislike",
				"shrunken people": "dislike",
				"shrunken person": "dislike",
				"shrunken woman": "dislike",
				"shrunken women": "dislike",
				"sidewalk": "dislike",
				"sitting": "dislike",
				"sitting on building": "dislike",
				"size comparison": "dislike",
				"size difference": "dislike",
				"sjw": "dislike",
				"sketch": "dislike",
				"sketching": "dislike",
				"skimpy clothing": "dislike",
				"skintight clothing": "dislike",
				"skirt": "dislike",
				"sky": "dislike",
				"skyscraper": "dislike",
				"skyscrapers": "dislike",
				"slave": "dislike",
				"sleeping": "dislike",
				"small": "dislike",
				"small gestures": "dislike",
				"small man": "dislike",
				"small men": "dislike",
				"small woman": "dislike",
				"smelly": "dislike",
				"smiling": "dislike",
				"smogass": "dislike",
				"smoke": "dislike",
				"smoke slave": "dislike",
				"smoking": "dislike",
				"smothering": "dislike",
				"smushedboy": "dislike",
				"snake girl": "dislike",
				"sneakers": "dislike",
				"snow": "dislike",
				"socks": "dislike",
				"sofa": "dislike",
				"soft vore": "dislike",
				"soldiers": "dislike",
				"soles": "dislike",
				"sonic the hedgehog": "dislike",
				"sorenzer0": "dislike",
				"source film maker": "dislike",
				"source needed": "dislike",
				"space": "dislike",
				"spacecraft": "dislike",
				"spaceship": "dislike",
				"spawngts": "dislike",
				"spokle": "dislike",
				"spoon": "dislike",
				"sports bra": "dislike",
				"squashing": "dislike",
				"squatting": "dislike",
				"squeezemeflat": "dislike",
				"stadium": "dislike",
				"stairs": "dislike",
				"standing": "dislike",
				"starkadhr": "dislike",
				"stars": "dislike",
				"star wars": "dislike",
				"stepped on": "dislike",
				"stepping": "dislike",
				"steven universe": "dislike",
				"stockings": "dislike",
				"stomach": "dislike",
				"stomach acid": "dislike",
				"stomach view": "dislike",
				"stomping": "dislike",
				"stool": "dislike",
				"storm": "dislike",
				"story": "dislike",
				"straddling": "dislike",
				"street": "dislike",
				"streets": "dislike",
				"street fighter": "dislike",
				"street view": "dislike",
				"stretching": "dislike",
				"striped panties": "dislike",
				"striped stockings": "dislike",
				"strolling": "dislike",
				"struggling": "dislike",
				"stuck": "dislike",
				"stuck to butt": "dislike",
				"stuck to foot": "dislike",
				"student": "dislike",
				"suburbs": "dislike",
				"succubus": "dislike",
				"sucking": "dislike",
				"suckling": "dislike",
				"suit": "dislike",
				"sun": "dislike",
				"sunbathing": "dislike",
				"sunglasses": "dislike",
				"sunny": "dislike",
				"sunset": "dislike",
				"supergirl": "dislike",
				"superhero": "dislike",
				"surprised": "dislike",
				"swallowed": "dislike",
				"sweat": "dislike",
				"sweater": "dislike",
				"swimming": "dislike",
				"swimsuit": "dislike",
				"sword": "dislike",
				"t-shirt": "dislike",
				"table": "dislike",
				"tail": "dislike",
				"tall": "dislike",
				"tan": "dislike",
				"tank": "dislike",
				"taran": "dislike",
				"tastysnack": "dislike",
				"tattoo": "dislike",
				"tattooed": "dislike",
				"taylor swift": "dislike",
				"tdart": "dislike",
				"teacher": "dislike",
				"teasing": "dislike",
				"teeth": "dislike",
				"testicles": "dislike",
				"text": "dislike",
				"tgirl": "dislike",
				"thaddeusmcboosh": "dislike",
				"the world god only knows": "dislike",
				"thick thighs": "dislike",
				"thighs": "dislike",
				"thigh highs": "dislike",
				"thinking": "dislike",
				"thong": "dislike",
				"thor66": "dislike",
				"throat": "dislike",
				"throat bulge": "dislike",
				"tie": "dislike",
				"tied to sex toy": "dislike",
				"tights": "dislike",
				"tinies": "dislike",
				"tiny": "dislike",
				"tiny-little-lisa": "dislike",
				"tiny mk": "dislike",
				"titfuck": "dislike",
				"toenails": "dislike",
				"toering": "dislike",
				"toes": "dislike",
				"toe crush": "dislike",
				"toe ring": "dislike",
				"toilet": "dislike",
				"toka": "dislike",
				"tolik": "dislike",
				"tongue": "dislike",
				"tontoblackadder": "dislike",
				"top": "dislike",
				"topless": "dislike",
				"torture": "dislike",
				"touching": "dislike",
				"touhou": "dislike",
				"towel": "dislike",
				"tower": "dislike",
				"town": "dislike",
				"toy": "dislike",
				"toyogub": "dislike",
				"tracer": "dislike",
				"traffic": "dislike",
				"train": "dislike",
				"trample": "dislike",
				"translate me": "dislike",
				"trapped": "dislike",
				"trapped inside": "dislike",
				"trayx": "dislike",
				"tree": "dislike",
				"trees": "dislike",
				"tribal": "dislike",
				"truck": "dislike",
				"twintails": "dislike",
				"twisted persona": "dislike",
				"t soni": "dislike",
				"ufo": "dislike",
				"ultra": "dislike",
				"unaware": "dislike",
				"underboob": "dislike",
				"underneath": "dislike",
				"underwater": "dislike",
				"underwear": "dislike",
				"under foot": "dislike",
				"undressing": "dislike",
				"uniform": "dislike",
				"unknown artist": "dislike",
				"unknown manga": "dislike",
				"unwilling": "dislike",
				"upskirt": "dislike",
				"up close": "dislike",
				"uru": "dislike",
				"uschi3": "dislike",
				"uvula": "dislike",
				"vaginal dryness": "dislike",
				"vehicles": "dislike",
				"vehicle crush": "dislike",
				"vehicle insertion": "dislike",
				"vehicle vore": "dislike",
				"victoria": "dislike",
				"video game": "dislike",
				"village": "dislike",
				"violence": "dislike",
				"virtual": "dislike",
				"virtual giantess": "dislike",
				"vivian": "dislike",
				"voluptuous": "dislike",
				"vore": "dislike",
				"wading": "dislike",
				"walking": "dislike",
				"watch": "dislike",
				"water": "dislike",
				"waterfall": "dislike",
				"waterfront": "dislike",
				"waves": "dislike",
				"waving": "dislike",
				"wet": "dislike",
				"white dress": "dislike",
				"white hair": "dislike",
				"white panties": "dislike",
				"willing": "dislike",
				"window": "dislike",
				"wine": "dislike",
				"wings": "dislike",
				"winking": "dislike",
				"winzling": "dislike",
				"witch": "dislike",
				"wolf": "dislike",
				"women": "dislike",
				"wonderslug": "dislike",
				"wonder woman": "dislike",
				"workout": "dislike",
				"world of warcraft": "dislike",
				"worship": "dislike",
				"wrestling": "dislike",
				"xanafar": "dislike",
				"xolittleonexo": "dislike",
				"yamumil": "dislike",
				"yellow eyes": "dislike",
				"zed782": "dislike",
				"zoolp": "dislike",
				"zoom": "dislike",
				"みとん": "dislike"
			};
			const fetishes = people.people[id].fetishes;
			const lowerOther = await Object.entries(fetishes).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
				map[val[0]] = val[1];
				return map;
			}, {});
			const lowerMain = await Object.entries(fetishes2).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
				map[val[0]] = val[1];
				return map;
			}, {});
			const commonDislikes = [];
			for (const val in lowerOther) {
				if (lowerMain[val] && lowerMain[val] === lowerOther[val] && lowerOther[val] === "dislike") {
					commonDislikes.push(val);
				}
			}
			dislikes = [];
			for (var key of commonDislikes) {
				dislikes.push(`-${encodeURIComponent(key.replace(" ", "_"))}`);
			}
			if (dislikes.length > 0) {
				tags = tags.concat(dislikes);
			}
			if (tags.length > 0 && !scat) {
				tags.push("-scat");
			}
			var tagString = tags.join("%2C");
			if (tagString) {
				tagString = "/" + tagString + "/1";
			}
			var pageToVisit = `http://giantessbooru.com/post/list${tagString}`;

			const j = request.jar();
			const cookie1 = request.cookie("agreed=true");
			const cookie2 = request.cookie(`ShowFurryContent=${furry}`);
			const cookie3 = request.cookie(`ShowMaleContent=${male}`);
			const cookie4 = request.cookie("ShowMQContent=true");
			const cookie5 = request.cookie("ShowLQContent=false");
			j.setCookie(cookie1, "http://giantessbooru.com");
			j.setCookie(cookie2, "http://giantessbooru.com");
			j.setCookie(cookie3, "http://giantessbooru.com");
			j.setCookie(cookie4, "http://giantessbooru.com");
			j.setCookie(cookie5, "http://giantessbooru.com");
			request({ url: pageToVisit, jar: j }, async (error, response, body) => {
				const link_array = [];
				const post_array = [];
				if (error) {
					console.log("Error: " + error);
				}
				if (response && response.statusCode === 200) {
					// Parse the document body
					const $ = await cheerio.load(body);
					if (response.request.uri.href.startsWith("http://giantessbooru.com/post/view/") || response.request.uri.href.startsWith("https://giantessbooru.com/post/view/")) { // gtsbooru redirects to the result pic page immediately if only 1 result exists, so we have to handle that specifically
						post_array.push(response.request.uri.path);
						var match = body.match(/\/_images\/([0-9a-zA-Z]+)\//gm);
						if (match && match[0]) {
							link_array.push(match);
						}
					}
					else if (!response.request.uri.href.startsWith("http://giantessbooru.com/post/view/") || !response.request.uri.href.startsWith("https://giantessbooru.com/post/view/")) {
						const thing = $(".thumb").children();
						for (var child in thing) {
							const child_thing = thing[child];
							if (child_thing.type === "tag") {
								link_array.push(child_thing.children[0].attribs.src.replace("/_thumbs/", "_images/").replace("/thumb.jpg", ""));
								post_array.push(child_thing.attribs.href);
							}
							else {
								break;
							}
						}
					}
				}
				const maths = Math.floor(Math.random() * link_array.length);
				if (link_array.length === 0) {
					Bot.createMessage(m.channel.id, "No image found for: **" + tags.join(", ") + "**");
					return;
				}
				const number = maths + 1;
				var imageURL = "http://giantessbooru.com/" + link_array[maths] + ".gif";
				var cleanTags = tags.join(", ");
				// SUCCESS
				const data = {
					content: "Results on **" + site + "**",
					embed: {
						color: 0xA260F6,
						footer: {
							icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
							text: "Searched by: " + name + ". Image " + number + " of " + link_array.length
						},
						image: {
							url: imageURL.toString()
						},
						author: {
							name: cleanTags,
							url: "http://giantessbooru.com" + post_array[maths]
						}
					}
				};
				Bot.createMessage(m.channel.id, data);
				return;
			});
			return;
		}

		if (site === "danbooru" || site === "dan" || site === "db") {
			if (tags.length > 1) {
				Bot.createMessage(m.channel.id, "Danbooru doesn't support searching with multiple tags this way. Only the first tag was used");
			}
			booru.search(site, [tags[0]], { limit, random: true }).then(function (images) {
				if (images.length === 0) {
					Bot.createMessage(m.channel.id, "No images were found on `" + site + "` for: **" + [tags[0]].join(", ") + "**").then((msg) => {
						return setTimeout(function () {
							Bot.deleteMessage(m.channel.id, m.id, "Timeout");
							Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
						}, 180000);
					});
					return;
				}
				// Cannot use images.map() or images.filter() due to a bug with the booru library
				var imageURLs = [];
				images.forEach(function (image) {
					imageURLs.push(image.fileUrl);
				});
				imageURLs.forEach(function (url, i) {
					const data = {
						embed: {
							color: 0xA260F6,
							footer: {
								icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
								text: "Searched by: " + name
							},
							image: {
								url: url
							},
							author: {
								name: cleanTags,
								url: url
							}
						}
					};
					if (i === 0) {
						data.content = "Results on **" + site + "**";
					}
					Bot.createMessage(m.channel.id, data);
				});
			})
				.catch(err => {
					if (err.name === "BooruError") {
						// It"s a custom error thrown by the package
						if (err.message === "You didn\"t give any images") {
							Bot.createMessage(m.channel.id, "No images were found on `" + site + "` for: " + tags[0]);
							return;
						}
						console.log(err.message);
						Bot.createMessage(m.channel.id, err.message);
					}
					else {
						// This means I messed up. Whoops.
						console.log(err);
						Bot.createMessage(m.channel.id, "An unknown error has occured");
					}
				});
			return;
		}

		booru.search(site, tags.join(" | ").split(" | "), { limit, random: true })
			.then(function (images) {
				if (images.length === 0) {
					Bot.createMessage(m.channel.id, "No images were found on `" + site + "` for: **" + tags.join(", ") + "**").then((msg) => {
						return setTimeout(function () {
							Bot.deleteMessage(m.channel.id, m.id, "Timeout");
							Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
						}, 180000);
					});
					return;
				}
				// Cannot use images.map() or images.filter() due to a bug with the booru library
				var imageURLs = [];
				images.forEach(function (image) {
					imageURLs.push(image.fileUrl);
				});
				imageURLs.forEach(function (url, i) {
					const data = {
						embed: {
							color: 0xA260F6,
							footer: {
								icon_url: m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
								text: "Searched by: " + name
							},
							image: {
								url: url
							},
							author: {
								name: cleanTags,
								url: url
							}
						}
					};
					if (i === 0) {
						data.content = "Results on **" + site + "**";
					}
					Bot.createMessage(m.channel.id, data);
				});
			})
			.catch(err => {
				if (err.name === "BooruError") {
					// It"s a custom error thrown by the package
					if (err.message === "You didn\"t give any images") {
						Bot.createMessage(m.channel.id, "No images were found on `" + site + "` for: **" + tags.join(", ") + "**");
						return;
					}
					console.log(err.message);
					Bot.createMessage(m.channel.id, err.message);
				}
				else {
					// This means I messed up. Whoops.
					console.log(err);
					Bot.createMessage(m.channel.id, "An unknown error has occured, please try again later").then((msg) => {
						return setTimeout(function () {
							Bot.deleteMessage(m.channel.id, m.id, "Timeout");
							Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
						}, 180000);
					});
				}
			});
	},
	help: "Search Boorus for images. `!booru list` for list"
};
