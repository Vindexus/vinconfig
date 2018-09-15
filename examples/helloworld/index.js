const config = require('./config')

console.log('Language: ' + config.lang.name)
console.log(config.lang.hello.repeat(config.numResponses))
process.exit(1)
