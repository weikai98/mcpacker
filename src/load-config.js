const path = require('path')
const fs = require('fs-extra')

const defaultConfigPath = 'mcpack.config.js'

const loadConfig = (configPath) => {
  if (!configPath) configPath = defaultConfigPath
  configPath = path.isAbsolute(configPath) ?
    configPath :
    path.resolve(process.cwd(), configPath)

  if (fs.existsSync(configPath)) {
    return require(configPath)
  }
}

module.exports = loadConfig