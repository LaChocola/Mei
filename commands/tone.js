var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var config = require("../etc/config.json");
var tone_analyzer = new ToneAnalyzerV3({
  username: config.tokens.ibm.username,
  password: config.tokens.ibm.password,
  version_date: '2016-05-19'
});

module.exports = {
    main: function(Bot, m, args) {
    var msg = m.cleanContent.replace("!tone ", "");
    tone_analyzer.tone({ text: msg },
  function(err, tone) {
    if (err) {
      console.log(err)
      Bot.createMessage(m.channel.id, err);
    }
    else {
      let tones = tone.document_tone.tone_categories; // All tone categories
      let topTones = {}; // Store all tones in here

    tones.forEach(t => { // Iterate through categire
    let [first] = t.tones.sort((a, b) => b.score - a.score); // Sort by descending score and get top one.
    first = {name: first.tone_name, percent: (first.score * 100).toFixed(1)}; // Get the tone's name
    topTones[t.category_id.split('_')[0]] = first; // Assign the name of the tone category to the top tone and add it to the tone object.
});
    var tone1 = "Emotional Tone: ***" + topTones.emotion.name + "***  | Score " + topTones.emotion.percent + "%"
    var tone2 = "Language Tone: ***" + topTones.language.name + "***  | Score " + topTones.language.percent + "%"
    var tone3 = "Social Tone: ***" + topTones.social.name + "***  | Score " + topTones.social.percent + "%"
    Bot.createMessage(m.channel.id, "Tones Detected: " + "\n" +  tone1 + "\n" + tone2 + "\n"+ tone3);

    // Bot.createMessage(m.channel.id, "Tones Detected: ***" + tone1 + "*** and ***" + tone2 + "***");
    }
});
    },
    help: "Watson Tone Analyzer"
}
