var config = require("../etc/config.json");
var Dictionary = require('mw-dictionary'),
	dict = new Dictionary({
		key: config.tokens.webster
	});


  module.exports = {
      main: function(Bot, m, args) {
          var word = (m.content.replace("!define ", ""));
          dict.define(word, function(error, result){
          	if (error == null) {
              var results = []
          		for(var i=0; i<(result.length*0.5); i++){
          			results.push('Definition '+(i+1)+'.' + '\nPart of speech: '+result[i].partOfSpeech + '\nDefinitions: '+ result[i].definition.replace(" :", "").split(":").join("\n"));
          		}
              Bot.createMessage(m.channel.id, {
                  content: "Definition of **" + word + "**:\n",
                  embed: {
                      color: 0xA260F6,
                      description: results.join("\n")
              }
          });
          	}
          	else if (error === "suggestions"){
          		var msg = "**" + word + '** not found in dictionary. Possible suggestions: \n ```'
              suggestions = []
          		for (var i=0; i<(result.length*0.5); i++){
          			suggestions.push(result[i]);
          		}
              Bot.createMessage(m.channel.id, msg + suggestions.join("\n") + "```");
          	}
          	else console.log(error);
          });
      },
      help: "Searches Websters Dictionary" // add description
  }
