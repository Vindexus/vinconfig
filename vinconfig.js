const debug = require('debug')('vinconfig')
const fs = require('fs')
const path = require('path')
const ArgumentParser = require('argparse').ArgumentParser;
const Validator = require('jsonschema').Validator
const v = new Validator()


function Vinconfig (schema = {}, opts = {}) {
  v.addSchema(schema)

  const parser = new ArgumentParser({
    addHelp: true,
    description: 'Specify config for Vinconfig. Override ENV vars with CLI arguments.'
  })

  parser.addArgument(['-c', '--config'], {
    description: 'Vinconfig variable. Full path to file or its name in the config folder',
    defaultValue: false
  })

  const args = parser.parseArgs()

  const directory = opts.directory || path.join(process.cwd(), 'config')
  const defaultConfig = opts.default || 'development'
  const envVar = opts.envVar || 'CONFIG'

  debug(`Config directory ${directory}`)
  debug(`Default config ${defaultConfig}`)

  let CONFIG = process.env[envVar] || defaultConfig

  if (args.config) {
    debug(`Using --config for CONFIG`)
    CONFIG = args.config
  }
  else {
    debug(`env var ${envVar} is ${CONFIG}`)
  }

  CONFIG = CONFIG.trim()
  let configPath
  if (fs.existsSync(CONFIG)) {
    debug(`Using file path from process.env.CONFIG`)
    configPath = CONFIG
  }
  else {
    debug(`Using config name '${CONFIG}'`)
    configPath = path.resolve(directory, CONFIG + '.json')
    if (!fs.existsSync(configPath)) {
      configPath = path.resolve(directory, CONFIG + '.js')
      if (!fs.existsSync(configPath)) {
        throw new Error(`Could not find config file at ${configPath}`)
      }
    }
  }

  debug(`Loading config file ${configPath}`)
  const config = require(configPath)
  debug(JSON.stringify(config, null, 2))

  const valid = v.validate(config, schema)

  if (valid.errors.length) {
    const msgs = []
    valid.errors.forEach(e => {
      msgs.push(e.stack)
      console.log('CONFIG ERR: ' + e.stack)
    })

    const err = `Config ${configPath} does not match provided schema: ${msgs.join(' & ')}`
    throw new Error(err)
  }

  return config
}

module.exports = Vinconfig
