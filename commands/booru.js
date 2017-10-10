const booru = require('booru')
var time = new Date().toISOString();
var request = require('request');
var request = request.defaults({jar: true})
var cheerio = require('cheerio');
var URL = require('url-parse');

module.exports = {
	main: function(Bot, m, args) {
    function isNumeric(num){
        return !isNaN(num)
    }

    var name = m.author.nick || m.author.username
		if (m.content == "!booru") {
			m.content = "!booru giantess"
		}
    var args = m.cleanContent.toLowerCase().replace("!booru ", "").split(", ")
    var site = "giantessbooru.com"
		var imageURL = [];
		var tags = [];
		var things = []
    var limit = 1
		var aliases = ["e6","e621","e9","e926","hh","hypo","hypohub","db","dan","danbooru","kc","konac","kcom","kn","konan","knet","yd","yand","yandere","gb","gel","gelbooru","r34","rule34",
		"sb","safe","safebooru","tb","tbib","big","xb","xbooru","yh","you","youhate","do","dollbooru","pa","paheal","lb","lol","lolibooru","dp","derp","derpi","derpibooru",
		"giantessbooru","gtsbooru","gbooru","giantessbooru.com"]

		var argsIterator = args.entries()
		for (let e of argsIterator) {
			if (isNumeric(+e[1])) {
				var limit = +e[1]
				args.splice(e[0], 1)
			}
			if (aliases.indexOf(e[1]) > -1) {
				site = e[1]
				args.splice(e[0], 1)
		}
	}

		for (let arg of args) {
			tags.push(arg)
    }

    var cleanTags = tags.join(", ")

		if (tags.length > 0) {
		var tag1 = tags[0]
		var tag2 = tags[1]
		var tag3 = tags[2]
		var tag4 = tags[3]
		var tag5 = tags[4]
		}

		if (site == "gtsbooru" || site == "giantessbooru" || site == "gbooru" || site == "giantessbooru.com") {
			if (tags.length < 1) {
				var pageToVisit = "http://giantessbooru.com/post/list"
			}
			else if (tags.length == 1) {
				var pageToVisit = "http://giantessbooru.com/post/list/" + tags[0] + "%2C-scat/1"
			}
			else if (tags.length > 1) {
				var pageToVisit = "http://giantessbooru.com/post/list/" + tags.join(",") + "%2C-scat/1"
			}
			if (m.channel.id == "187702595723329536") {
				if (tags.length < 1) {
					var pageToVisit = "http://giantessbooru.com/post/list"
				}
				else if (tags.length == 1) {
					var pageToVisit = "http://giantessbooru.com/post/list/" + tags[0]
				}
				else if (tags.length > 1) {
					var pageToVisit = "http://giantessbooru.com/post/list/" + tags.join(",")
				}
			}
			var j = request.jar();
			var cookie1 = request.cookie('agreed=true');
			var cookie2 = request.cookie('ShowFurryContent=true');
			var cookie3 = request.cookie('ShowMaleContent=true');
			j.setCookie(cookie1, pageToVisit);
			j.setCookie(cookie2, pageToVisit);
			j.setCookie(cookie3, pageToVisit);
			request({url: pageToVisit, jar: j}, function(error, response, body) {
			var link_array = []
				 if(error) {
					 console.log("Error: " + error);
				 }
				 if(response.statusCode === 200) {
					 // Parse the document body
					 var $ = cheerio.load(body);
							 var thing = $('.thumb').children()
							 for(child in thing){
									 let child_thing = thing[child];
									 if (child_thing.type == 'tag'){
												link_array.push(child_thing.attribs.href);
									 }
									 else { break; }
							 }
					 }
					 const maths = Math.floor(Math.random() * link_array.length)
					 const pageToVisit = "http://giantessbooru.com" + link_array[maths]
					 if (link_array.length < 1) {
					 Bot.createMessage(m.channel.id, "No image found for: **" + tags.join(", ") + "**");
					 return;
				 }
					 var j = request.jar();
					 var cookie1 = request.cookie('agreed=true');
					 var cookie2 = request.cookie('ShowFurryContent=true');
					 var cookie3 = request.cookie('ShowMaleContent=true');
					 j.setCookie(cookie1, pageToVisit);
					 j.setCookie(cookie2, pageToVisit);
					 j.setCookie(cookie3, pageToVisit);
					 request({url: pageToVisit, jar: j}, function(error, response, body) {
						if(response.statusCode === 200) {
							 // Parse the document body
							 var $ = cheerio.load(body);
							 var imgURL = $('#main_image')[0].attribs.src
							 imageURL.push("http://giantessbooru.com" + imgURL.toLowerCase())
							 }
							 if (imageURL.length < 2) {
								 var number = maths + 1
								 const data = {
									 "content": "Results on **" + site + "**",
									 "embed": {
										 "color": 0xA260F6,
										 "footer": {
											 "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
											 "text": "Searched by: " + name + ". Image " + number + " of " + link_array.length
										 },
										 "image": {
											 "url": imageURL.toString()
										 },
										 "author": {
											 "name": cleanTags,
											 "url": imageURL.toString()
										 }
									 }
								 };

								 Bot.createMessage(m.channel.id, data);
							 } else if (imageURL.length > 1) {
								 const data = {
									 "content": "Results on **" + site + "**",
									 "embed": {
										 "color": 0xA260F6,
										 "footer": {
											 "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
											 "text": "Searched by: " + name + ". Image " + maths + " of " + link_array.length
										 },
										 "image": {
											 "url": imageURL[0].toString()
										 },
										 "author": {
											 "name": cleanTags,
											 "url": imageURL[0].toString()
										 }
									 }
								 };
								 Bot.createMessage(m.channel.id, data)
								 imageURL.splice(0, 1);
								 var iterator = imageURL.entries()

								 for (let e of iterator) {
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

    if (site == "danbooru" || site == "dan" || site == "db" && tags.length > 2) {
      Bot.createMessage(m.channel.id, "Danbooru doesnt support searching with multiple tags this way. Only the first tag was used")
    }

    if (site == "danbooru" || site == "dan" || site == "db") {
    booru.search(site, [tag1], {limit: limit, random: true})
    .then(booru.commonfy)
    .then(images => {
      //Log the direct link to each image
      for (let image of images) {
        imageURL.push(image.common.file_url)
				Bot.createMessage(m.channel.id, "Result for: **" + tag1 + (", ") + "** on " + site + "\n" + imageURL)
      }
    })
    .catch(err => {
      if (err.name === 'booruError') {
        //It's a custom error thrown by the package
        console.log(err.message)
				Bot.createMessage(m.channel.id, err.message);
      } else {
        //This means I messed up. Whoops.
        console.log(err)
      }
    })
    return;
  }


		else if (tags.length < 0) {
		Bot.createMessage(m.channel.id, "Please input your search tags and/or booru. A list is availible by doing ``!boorus``")
		return;
	}
    booru.search(site, [tag1, tag2, tag3, tag4, tag5], {limit: limit, random: true})
    .then(booru.commonfy)
    .then(images => {
      //Log the direct link to each image
      for (let image of images) {
        imageURL.push(image.common.file_url)
      }


    if (imageURL.length == 1) {
      const data = {
        "content": "Results on **" + site + "**",
        "embed": {
          "color": 0xA260F6,
          "footer": {
            "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
            "text": "Searched by: " + name
          },
          "image": {
            "url": imageURL.toString()
          },
          "author": {
            "name": cleanTags,
            "url": imageURL.toString()
          }
        }
      };

      Bot.createMessage(m.channel.id, data);
    } else if (imageURL.length > 1) {
      const data = {
        "content": "Results on **" + site + "**",
        "embed": {
          "color": 0xA260F6,
          "footer": {
            "icon_url": m.channel.guild.members.get(m.author.id).avatarURL.replace(".jpg", ".webp?size=1024"),
            "text": "Searched by: " + name
          },
          "image": {
            "url": imageURL[0].toString()
          },
          "author": {
            "name": cleanTags,
            "url": imageURL[0].toString()
          }
        }
      };
      Bot.createMessage(m.channel.id, data)
      imageURL.splice(0, 1);
      var iterator = imageURL.entries()

      for (let e of iterator) {
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
      if (err.name === 'booruError') {
        //It's a custom error thrown by the package
        console.log(err.message)
				Bot.createMessage(m.channel.id, err.message);
      } else {
        //This means I messed up. Whoops.
        console.log(err)
      }
    })

	},
	help: "Search Boorus for images."
}
