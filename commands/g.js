'use strict';
const _ = require("../people.js");
var data = _.load();
module.exports = {
	main: function(Bot, m, args) {
		var args = args.toLowerCase()
		function capFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
}
    var prefix = '!'
		var male = false
		var names = ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Baiken", "Ryuko", "Sombra", "Wolfer", "Gwen", "Mercy", "Gwynevere", "Tracer",
		"Aqua", "Megumin", "Cortana", "Yuna", "Lulu", "Rikku", "Rosalina", "Samus", "Princess Peach", "Palutena", "Shin", "Kimmy", "Zoey", "Camilla", "Lillian", "Narumi", "D.va"];
		var cleanishNames = names.join(', ')
		var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n").replace("Baiken,", "Baiken,\n").replace("Gwen,", "Gwen,\n").replace("Aqua,", "Aqua,\n").replace("Lulu,", "Lulu,\n").replace("Samus,", "Samus,\n")
		var mentioned = m.mentions[0] || m.author
		var id = mentioned.id

		if (m.guild.id === "261599167695159298") { // Krumbly's ant farm only
			var names = ["Mei", "Sucy", "2B", "Mt. Lady", "Rika", "Miku", "Lexi", "Lucy", "Ryuko", "Krumbly"];
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
			var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
		}
		if (m.guild.id === "319534510318551041") { // The Big House Only
			var names = names.concat(["Zem", "Ardy", "Vas"])
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
			var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
		}
		if (m.guild.id === "354709664509853708") { // Small World Only
			var names = names.concat(["Docop", "Mikki", "Spellgirl"])
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
			var cleanNames = cleanNames.replace("Lucy,", "Lucy,\n")
		}
		if (m.guild.id === "345390985150201859") { // The Giantess Club Only
			var names = ["Yami","Mikan","Momo","Nana","Yui","May","Dawn","Hilda","Rosa","Serena","Palutena","Wii Fit Trainer","Lucina","Robin","Corrin","Bayonetta","Zelda","Sheik",
		"Tifa","Chun-li","R. Mika","Daisy","Misty","Gardevoir","Lyn","Cammy","Angewomon","Liara","Samara","Tali","Miranda","Cus","Marcarita","Vados","Wendy","Sabrina","Cana","Erza",
		"Levy","Lucy","Wendy Marvell"];
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Hilda,", "Hilda,\n")
			var cleanNames = cleanNames.replace("Lucina,", "Lucina,\n")
			var cleanNames = cleanNames.replace("Chun-li,", "Chun-li,\n")
			var cleanNames = cleanNames.replace("Cammy,", "Cammy,\n")
		}
		if (m.guild.id === "296104080957505546") { // The Bean Empire Only
			var names = ["Terra", "Lexi", "Kiri", "Rosa", "Duni", "Lucy", "Kyla", "Pauline"];
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Duni,", "Duni,\n")
		}

		if (m.guild.id === "344035503634382848") { // Macro Utopia Only
			if (m.channel.id != "344928612539170816") { // Not in the Giantess only channel
			var names = ["Kurama", "Inuyasha", "Tomoe", "Mikazuki", "Kogitsunemaru", "Koga", "Nakigitsune", "Mutsunokami", "Izuminokami", "Ranulf", "Keaton", "Kaden", "Leon", "Felix",
			"Myabi", "Kuronue", "Kiba", "Max", "Luka", "Tholo", "Kageyama", "Niko", "Naruto", "Ignus", "Kevin", "Iso", "Ita", "Ban", "Sebastian", "Pluto", "Nate", "Jeff", "Aaron", "Jay"];
			var cleanishNames = names.join(', ')
			var cleanNames = cleanishNames.replace("Mikazuki,", "Mikazuki,\n")
			var cleanNames = cleanNames.replace("Leon,", "Leon,\n")
			var male = true
			} else {
					var male = false
			    var names = Array.from(new Set(["Kagome", "Ahri", "Holo", "Nanami"].concat(names)))
					var cleanishNames = names.join(', ')
					var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n").replace("Baiken,", "Baiken,\n").replace("Gwen,", "Gwen,\n").replace("Aqua,", "Aqua,\n").replace("Lulu,", "Lulu,\n").replace("Samus,", "Samus,\n")
				}
			}

		var customName = [];
		if (data.people[id]) {
			if (data.people[id].names) {
				var namesObj = data.people[id].names
				var names = [];
				Object.keys(namesObj).forEach(function(key){
					 names.push(key);
				});
			}
		}

		var argsArray = args.split(' ')

		argsArray.forEach(function(arg) {
			var arg = capFirstLetter(arg)
			if (names.includes(arg) === true) {
				customName.push(arg)
			}
		});

		if (customName.length > 0) {
			var name = customName[Math.floor(Math.random() * customName.length)]
		} else {
			var name = names[Math.floor(Math.random() * names.length)]
		}

		if (data.people[id]) {
			if (data.people[id].names) {
				if (data.people[id].names[name] == "male") {
					var male = true
				}
			}
		}

		var nameLength = names.length

		var butt = [
"You had a safe trip home in " + name + "'s back pocket",
"You spent the warm night pinned under " + name + "’s left cheek",
"You slid down " + name + "’s back like a water slide as she bathed, only to land between her butt cheeks",
name + " laughed as she watched you struggle to get out of her tangled panties",
name + " let you lie on her butt, enjoying her warmth, as she read a book to you",
"You through " + name + " into a fit of hysterics by using her butt as a trampoline. It was so much fun that eventually giant-woman butt trampoline became an Olympic sport.",
"You frolicked around the hills of " + name + "'s butt like a playful child while she giggled.",
"An enjoyable night between " + name + "'s cheeks was had by all.",
"You hosted your birthday picnic on " + name + "'s backside. All she asked was that you bring her a sandwich.",
name + " allowed you to venture through the peachy hills of her butt cheeks, only for her to press them together and rub them around until you came.",
"You spent a nice day tucked into the back of " + name + "'s underpants. She even remembered you when she sat down!"
];
		var buttLength = butt.length
		var buttGentle = butt[Math.floor(Math.random() * butt.length)]

		var foot = [
"You had an adventure on " + name + "'s feet when she shrunk you further for the afternoon",
"You had a safe trip home in between " + name + "'s toes",
"Your tiny body was stepped on, and ground on so good by " + name + ", you were overwhelmed with pleasure, came hard, and passed out",
"You exhausted yourself while trying to give " + name + " a pedicure",
name + " trapped you between her toes and wiggled you around while giggling",
"You received the most intense foot job of your life from " + name + " , especially considering you were as tall as her foot was wide.",
"You spent the day at the beach sunbathing on " + name + "'s smooth sole. Later that day " + name + " looked like a bit of maniac smearing ice-cream on her foot.",
"You gave giant ladies foot rubs at the local spa. The one you gave to " + name + " was so good that she came back just to see you; even outside of work she began visiting you.",
name +  " almost cried when she accidentally stepped on you one day. She spent the following days nursing you back to full health and catering to your every need. When you were healed, she didn’t want to give you up.",
"You sat between " + name + "'s big and second toes as she kicked her feet up and relaxed.",
"The size you were all it took was a caressing toe to get you to climax. " + name + "  was delighted to indulge your little kink as she sat back and wiggled her digits over you.",
"You hugged " + name + "'s foot as you straddled her lower calf, and she put her feet up to the fire on a chilly night.",
name + " placed her feet together and filled the gap with water for your bath.",
"You slid down " + name + "'s arch like a water slide."

];
		var footLength = foot.length
		var footGentle = foot[Math.floor(Math.random() * foot.length)]

		var voreMouth = [
"You had no worries when " + name + " asked you to clean her teeth",
"You had a refreshing swim in " + name + "'s milk tea boba",
"You had a kiss stolen when " + name + " pretended to eat you",
"You had an intimate moment with " + name + " when she gave you a soft kiss",
"You had a blast as you used " + name + "'s tongue as a bouncy castle",
"You were lapped up by " + name + "’s enormous tongue and got spit out on soft tissue",
"You spend a whole day being toyed with in the humidity of " + name + "’s mouth",
"You were playing a balancing game on " + name + "’s nose before tumbling down and sliding onto her plump lips",
"You spend the night kissing and snuggling " + name + "'s lips in her sleep",
"" + name + " pretended to eat you by holding you over her open mouth, much to her amusement",
name + " acted like she didnt see you stuck to her lollipop as she brought you to her lips for a kiss",
"The tongue of " + name + " wrapped around your body like you were a lollipop. " + name + " really meant it when she said you tasted good.",
"Fellatio can prove quite dangerous at your size. " + name + " built a specially made tiny bed with a harness specifically to protect you.",
name +  " lathered your body in anti-acid and dropped you into her empty stomach, indigestible. You spent the day kicking back inside her as she went about her business, retching you up at the end of the day.",
name + " gave you the most insane blow-job of your life.",
name + " always had a breath mint on hand for whenever you wanted her to suck on you like a piece of candy.",
"You were sucked into " + name + "'s mouth when she kissed you. Luckily she spat you out and apologised.",
"You grinded into " + name + "'s tooth as if it were a lover.",
"You had a relaxing steamy bath in the humid pool underneath " + name + "'s tongue."
];
		var voreLength = voreMouth.length
		var voreGentle = voreMouth[Math.floor(Math.random() * voreMouth.length)]

		var handPlay = [
"You were lightly pressed under " + name + "'s index finger and feel her warmth engulf your form",
"You had an enjoyable, yet underrated, handplay session with " + name + ".",
"You had a hilarious waltz with " + name + " under the stars, as you clung onto her fingernail",
"You exhausted yourself while trying to give " + name + " a manicure",
"You were given a sensuous massage by " + name + "’s enormous fingers",
"You made a game out of dodging " + name + "’s fingers as she typed away on the keyboard",
"You using paint roller to painted " + name + "’s nails while she doted on you",
"You were given a balmy hug between " + name + "’s two palms",
"You were booped by " + name + "’s finger after you were caught staring at her breasts",
"You painted " + name + "’s nails and added some very small and fine patterns. She really adored your effort",
"You made " + name + "’s nails shiny and glossy and received a big kiss as rewards",
"" + name + " slowly elevated you up the length of her body on her finger. Ensuring that you get the best view",
name + " rolled you between her palms, giving you a massage as she relieved her stress",
"You snuggled into " + name + "'s giant finger as if it were a person.",
"You slept peacefully in the doughy palm of " + name,
name + " had fun petting her newest puppy: you.",
"On a cold winter's night " + name + " rubbed her hands together and held you lovingly to warm you up.",
"The crease of " + name + "'s palm was the perfect napping spot for you.",
name + " pushed you all around her body sensually with only a single finger."
];
		var handLength = handPlay.length
		var handGentle = handPlay[Math.floor(Math.random() * handPlay.length)]

		var legs = [
"You had a movie night with " + name + ", relaxing between her thighs",
"You were trapped in " + name + "’s nylons for an evening",
name + " noticed you were cold, so she pulled back her stockings, and trapped you between her warm thighs",
name + " let you use her fishnets as a jungle gym as you climbed around inside them",
name + " trapped you between her legs when she sat down Indian style, barracading you inside",
"Like a gun in a thigh holster you spent the day at the cusp of " + name + "'s thigh-high sock. Her rocking steps only served to put you to sleep.",
"You slept soundly in the gap between " + name + "'s crossed legs.",
"You received an intense thigh job from " + name + " .",
"To work out some stress, " + name + " allowed you to straddle and hump her calf.",
"You hugged into the hemisphere of " + name + "'s giant ankle.",
name + " set up a series of apartments dangling from her anklet. You happily moved in."
];
		var legsLength = legs.length
		var legsGentle = legs[Math.floor(Math.random() * legs.length)]

		var breasts = [
"You had a safe trip home in between " + name + "'s breasts",
"You had a soft hug with " + name + "'s chest",
"You had a bonding tutoring session with " + name + ", sitting atop her breast while she's teaching you.",
"You had a comfortable ride while tucked away in " + name + "'s bra",
"You slid down " + name + "’s collarbone and into her cleavage",
"You were warmly engulfed between " + name + "’s breasts",
"You were playing a balancing game on " + name + "’s nose before tumbling down her face and landing snug in her cleavage",
"You were tipped into " + name + "’s snug bras, she got a good laugh out of it",
"You woke up face first snug between " + name + "’s breasts",
"You fell asleep snuggling " + name + "'s nipple",
name +  " constructed a hammock over her cleavage for you to sit. It ‘accidentally’ collapsed, keeping you deep between the fleshy mountains as she playfully giggled.",
name +  " kept you safe when her friends tried to pinch your cheeks with their giant fingers. She tucked you into her bra so they couldn’t harass you anymore.",
"You sat against " + name + "'s soft nipple as she lay down and watched movies with you.",
"You grinded into the ground romantically tucked between the giant boobs of " + name,
name + " enjoyed the licking and sucking you did to the corner of her erect nipple, even though it was difficult to get even a tiny bit in your mouth.",
"You build a perch on " + name + "'s necklace for you to sit.",
"Even though you attempt to jump from one of " + name + "'s nipples to the next, she didn't mind you staying between her boobs when you landed short."
];
		var breastLength = breasts.length
		var breastGentle = breasts[Math.floor(Math.random() * breasts.length)]

		var sides = ["front", "back"]
		var side = sides[Math.floor(Math.random() * sides.length)]
		var types1 = ["panties", "underwear", "thongs"]
		var type1 = types1[Math.floor(Math.random() * types1.length)]
		var types2 = ["panty", "thong", "underwear"]
		var type2 = types2[Math.floor(Math.random() * types2.length)]

		if (male) {
			var types1 = ["underwear", "boxers", "briefs"]
			var type1 = types1[Math.floor(Math.random() * types1.length)]
			var types2 = ["underwear", "underwear"]
			var type2 = types2[Math.floor(Math.random() * types2.length)]
		}

		var panty = [
name + " tucked you into the " + side + " of her " + type1 + ", since she had nowhere else to put you",
name + " left you in her discarded " + type1 + ", she knew you loved it in there",
name + " let you sleep in her " + type1 + " for the night, her special treat",
name + "'s " + type1 + " were just out in the open, she knew you'd go for them so she left a little of her juices in there for you",
"You hid in " + name + "'s " + type2 + " drawer, just to pick out your favorite one to ride in",
name + " let you choose her " + type1 + " for today, and even let you ride in them",
"You climbed into the " + side + " of " + name + "'s " + type1 + ", giving her a lovely surprise when she wakes up",
"You were tired of walking, so " + name + " let you ride in the " + side + " of her " + type1 + "",
"If it made you feel any better, " + name + " did feel you in her " + type1 + ", she was just teasing you",
name + "'s juices covered you once you were done inside her " + type1 + "",
name + " wished you could stay in her " + type1 + " forever...",
"You tickled " + name + "'s pussy from inside her " + type1 + " during class... maybe not the best idea, but she wouldnt complain",
"You stood on " + name + "'s stomach, gazing down at her " + type1 + " as she lifted them for you and poked you into them for the day",
"You were held firmly in the " + side + " of " + name + "'s " + type1 + " as she sat in class, squirming slightly as she felt you rub againt her",
name + " will always let you into her " + type1 + " to cheer you up...",
name + " made sure you came first, before snapping her " + type1 + " closed with you trapped in the " + side,
"You were trapped and tangled inside " + name + "'s underwear drawer, lost among the " + type1 + " as she came out of the shower",
"While watching a scary movie " + name + " dropped you into her panties to shield you innocent eyes from the terrifying monster on screen.",
"You had an enjoyable day in the hammock of " + name + "'s panties.",
"After you got a bad headache, " + name + " kept you in the shade of panties to relax, away from the bright light.",
name + " sneaked you into work smuggled away in her panties. You had an enjoyable day goofing off both inside and out of the garments.",
name + " brought you into a party tinies weren't allowed in smuggled in her panties. You got to enjoy the dancing as she gyrated her hips.",
"You had a nice nap with your favourite pillow tucked into " + name + "'s panties while she went about her day."
		];
		var pantyLength = panty.length
		var pantyGentle = panty[Math.floor(Math.random() * panty.length)]

		var misc = [
"" + name + " teasingly looms over your form and giggles as she see your reaction",
"You had a tranquil time reading with " + name + "",
"You had a short cuddle session with " + name + " to lift your spirits",
"You had a fun time browsing the internet with " + name + "",
"You had a warm time playing hide and seek on " + name + "'s body",
"You had a fun bath with " + name + " and her rubber ducky",
"You had a romantic night-in with " + name + ". She even cooked for you!",
"You had a funny photo booth experience with " + name + ", clinging on her face",
"You had a candid massage session with " + name + "",
"You had a flirtatious moment with " + name + "",
"You had a night of Dungeons and Tinies with " + name + " as the GM",
"You had a steamy confession with " + name + " backing you up",
"You had a heartfelt confession which " + name + " accepted",
"You had a wacky adventure to tell your future grandkids, with " + name + ", on " + name,
"You had a book club meeting with " + name + "",
"You had a risqué full body exploration with " + name + "",
"You had a discussion on the finer points of GTS with " + name + "",
"You had a nice nap in " + name + "'s comfy navel",
"You had some boating experience from atop of a rubber ducky, floating in a bath of " + name + "",
"You had a highly successful spelunking trip into " + name + " as she slept",
"You had a tough climb up " + name + "’s body as she gave you words of encouragement",
"You were used as bath salt by " + name + " while she was in the shower and survive the experience",
"" + name + " chased you around with the tip of pencil while giggling childishly",
"You woke up to " + name + "’s sleeping face covering your entire field of vision",
"You woke up to " + name + "’s smiling face, smiling down at you on her pillow",
"You spend an afternoon watching rom coms with " + name + " whilst nestled on her collarbone",
"You were suntanning on " + name + "’s stomach and left a dot of tanline inprint of your body on it",
"You played a board game with " + name + ", but she had to roll the dice for you, teasing you all night for it",
"You couldn’t stop " + name + " from doodling the complex maze around you while you stand on paper",
"You got lost wading through " + name + "’s hair but she finally found you while she was combing",
"You doodled on " + name + "’s face while she sleeps",
"You were blasted through the air by " + name + "’s sudden sneeze and landed safely on her vast lap",
"You and " + name + " fell asleep watching movies together",
"You rode on " + name + "’s shoulder while she moved about the house, humming sweet tunes",
"" + name + " prepared you a small bottle cap full of clean water so you could swim a lap",
"You latched to " + name + "’s hair for safety when you two went on a bike ride",
"You snuck under a pile of " + name + "'s laundry while you and " + name + " were playing Hide and Seek, she found you after 10 minutes of cute teasing.",
"You tried to flip the pages of the book " + name + " was reading and finally succeed, only to know later that she's the one flipping it",
name +  " kissed you so hard she left a bruise. She felt so bad she looked up ways to make her lips softer for next time.",
name +  " booked a day at the movies together. When she realised how loud it was to your tiny ears, she fashioned earmuffs from the marshmallows she had brought in to enjoy.",
"You sunk into the ‘bean bag’ of " + name + "'s marshmallow, floating on the warm sea of her hot coco as she blew you around the mug, smiling,",
"After a life time of bullying at the hands of two cruel women, " + name + " rescued you, protected you, and still kisses any injuries you received from them better.",
name +  " went cross-eyed trying to look at you hugging her on the bridge of her nose.",
"You discovered that sitting in " + name + "'s belly button was quite comfortable, which only proved you had much more exploring around her body to do.",
"It had taken many months of work, but you created the perfect room for yourself. You would sleep every night inside a tiny pill inserted into " + name + "'s womanhood.",
name +  " was determined to find the place on her body best for cuddling with you. It was eventually decided that it was impossible to decide, so it was best to do it as many places as possible.",
"You curled up into a ball and slept on " + name + "'s exposed belly as she played video-games.",
name +  " giggled as you purred in response to her petting you. From then on she only called you kitten.",
"You had fun playing with " + name + "'s giant puppy for the day. You slept on its warm back as he curled up on " + name + "'s lap; and she didn’t know which one of you was cuter.",
"You had a relaxing night cooking with " + name + " . Although you steered clear of her gigantic chopping knife.",
"You took the plunge of the cliff: bungee jumping could be fun, especially when " + name + "'s spread vagina was where you were jumping into.",
name +  "'s pocket was so filled with your decorations and comforts that it basically became your room. You had several arguments about installing an en suite bathroom somehow.",
"You were awarded most impressive display at the fair by holding onto " + name + "'s giant body while she danced wildly. She won the dancing award too.",
"You plucked a giant dandelion and carried the gigantic weight all the way to " + name + " to impress her. She caught you when the wind picked up and you were almost carried away.",
"At the first look at you " + name + " was so taken by your adorableness that squealed. When she realised her squeal hurt your ears she cried, and you needed to comfort her.",
name + " didn't even care you ruined your tuxedo by swimming through the cake on your wedding night.",
name + " and you enjoyed a romantic honeymoon on a pacific island.",
"When the celebrant said 'you may now kiss the bride', " + name + " blushed because she knocked over the front row as she bent down on all fours to reach you.",
"It was a delightful surprise that the groom was inside the bride, " + name + "'s elegant white glove all along.",
"It took a team of burly men to lift the wedding ring you gifted to " + name + " and slip it on her finger"
];
		var miscLength = misc.length
		var miscGentle = misc[Math.floor(Math.random() * misc.length)]
if (male ==  true) {
		var gentle = butt.concat(foot, voreMouth, handPlay, legs, misc);
		var gentle1 = gentle[Math.floor(Math.random() * gentle.length)]
		var gentle1 = gentle1.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var miscGentle = miscGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var buttGentle = buttGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var handGentle = handGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var legsGentle = legsGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var voreGentle = voreGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")
		var footGentle = footGentle.replace(" her", " him").replace(" she", " he").replace(" GTS", " GT").replace(" breasts", " chest")

} else if (male != true) {
		var gentle = butt.concat(foot, voreMouth, handPlay, legs, breasts, misc);

		var gentle1 = gentle[Math.floor(Math.random() * gentle.length)]
}

var glength = gentle.length

	if (m.content.toLowerCase() === `${prefix}g length`) {
		var total = glength
		var cleanishNames = names.join(', ')
		var cleanNames = cleanishNames.replace("Mt. Lady,", "Mt. Lady,\n")
		Bot.createMessage(m.channel.id, {
				embed: {
						color: 0xA260F6,
						description: "**Names Availible: **" + nameLength + "\n " + cleanNames + "\n \n**Total Gentle's:** " + total + "\n \n**Butt Gentle's:** " + buttLength + "\n**Foot Gentle's:** " + footLength + "\n**Vore Death's:** " + voreLength + "\n**Hand Gentle's:** " + handLength + "\n**Leg Gentle's:** " + legsLength +
						"\n**Boob Gentle's:** " + breastLength + "\n**Panty Gentle's:** " + pantyLength + "\n**Misc Gentle's:** " + miscLength
				}
		});
}

	if (m.content.toLowerCase() == `${prefix}g someone`) {
			var members = m.channel.guild.members;
			var people = []
				 members.forEach(function(member){
								 if ((member.status != "offline") && (member.user.id != '309220487957839872')) {
										people.push(member.id)
								 }
				 });
		 var person = people[Math.floor(Math.random() * people.length)]
		 Bot.createMessage(m.channel.id, "<@" + person + ">, " + gentle1)
	}


	if (m.content.toLowerCase().startsWith(`${prefix}g`) && m.content.toLowerCase() != `${prefix}g length`) {
		var tellem = "<@" + m.author.id + '>, '
		 switch (m.author.id) {
			 default: {

				 if (m.mentions.length > 0) {
					 var smushee = m.channel.guild.members.get(m.mentions[0].id).nick || m.mentions[0].username
					 var tellem = "**" + smushee + ",** "
						}

						 if (args.indexOf("butt") > -1 || args.indexOf("ass") > -1 || args.indexOf("bum") > -1 || args.indexOf("bums") > -1 || args.indexOf("butts") > -1) {
							 Bot.createMessage(m.channel.id, tellem + buttGentle);
						 }
						 else if (args.indexOf("foot") > -1 || args.indexOf("feet") > -1 || args.indexOf("foote") > -1) {
							 Bot.createMessage(m.channel.id, tellem + footGentle);
						 }
						 else if (args.indexOf("panty") > -1 || args.indexOf("panties") > -1 || args.indexOf("underwear") > -1 || args.indexOf("thong") > -1 || args.indexOf("thongs") > -1 || args.indexOf("pantie") > -1) {
							 Bot.createMessage(m.channel.id, tellem + pantyGentle);
						 }
						 else if (args.indexOf("vore") > -1 || args.indexOf("mouth") > -1)  {
							 Bot.createMessage(m.channel.id, tellem + voreGentle);
						 }
						 else if (args.indexOf("hand") > -1 || args.indexOf("hands") > -1) {
							 Bot.createMessage(m.channel.id, tellem + handGentle);
						 }
						 else if (args.indexOf("legs") > -1 || args.indexOf("leg") > -1 || args.indexOf("thighs") > -1)  {
							 Bot.createMessage(m.channel.id, tellem + legsGentle);
						 }
						 else if (args.indexOf("boobs") > -1 || args.indexOf("breasts") > -1 || args.indexOf("breast") > -1 || args.indexOf("boob") > -1 || args.indexOf("tit") > -1 || args.indexOf("tits") > -1) {
							 Bot.createMessage(m.channel.id, tellem + breastGentle);
						 }
						 else if (args.indexOf("misc") > -1 || args.indexOf("alt") > -1 || args.indexOf("other") > -1) {
							 Bot.createMessage(m.channel.id, tellem + miscGentle);
						 }
						 else {
							 Bot.createMessage(m.channel.id, tellem + gentle1);
						 }

			 }
		 }
	 }
 },
	help: "A Gentle smush"
}
