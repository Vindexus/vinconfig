const debug = require('debug')('vinconfig')
const fs = require('fs')
const path = require('path')
const Validator = require('jsonschema').Validator
const v = new Validator()


function Vinconfig (schema = {}, opts = {}) {
  v.addSchema(schema)

  const directory = opts.directory || path.join(process.cwd(), 'config')
  const defaultConfig = opts.default || 'development'
  const envVar = opts.envVar || 'CONFIG'

  debug(`Config directory ${directory}`)
  debug(`Default config ${defaultConfig}`)

  let CONFIG = process.env[envVar] || defaultConfig

  debug(`env var ${envVar} is ${CONFIG}`)

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
