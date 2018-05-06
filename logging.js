
var loglevel = 0; // Need to put this in a config file...

function log(message, level) {
  if (level >= loglevel) {
    console.log("[" + (new Date().toISOString()) + "] ", message)
  }
}

module.exports = {
  'LOG_EVERYTHING': 0,
  'LOG_DEBUG': 1,
  'LOG_INFO': 2,
  'LOG_WARN': 3,
  'LOG_ERROR': 4,
  'log': log
}
