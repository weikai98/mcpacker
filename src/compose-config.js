const path = require('path')
const composeBrowserConfig = require('./env/browser-config.js')
const composeNodeConfig = require('./env/node-config.js')

const isBrowser = (key) => key === 'browser'
const isNode = (key) => key === 'node'

const composeConfig = (config) => {
  const {
    entries,
    clear,
    sourcemap,
    copy,
    ...otherConfig
  } = config
  const rollupConfig = []
  let _composeConfigFn

  const keys = Object.keys(otherConfig)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isBrowser(key)) {
      _composeConfigFn = (res) => composeBrowserConfig({
        ...otherConfig[key],
        ...res
      })
      break
    } else if (isNode(key)) {
      _composeConfigFn = (res) => composeNodeConfig({
        ...otherConfig[key],
        ...res
      })
      break
    }
  }

  for (const key in entries) {
    if (Object.hasOwnProperty.call(entries, key)) {
      const module = entries[key]
      const output = module.output.match(/(?<=\/)[^\/]+(?=\.js$)/)[0]
      const {
        plugins,
        external,
        globals
      } = _composeConfigFn
        ?
        _composeConfigFn({
          outputHtmlName: output,
          module
        }) : {}

      const inputOption = {
        external: external,
        input: path.resolve(process.cwd(), module.input),
        plugins,
        //  onwarn: warn(entryName)
      }

      const outputOption = {
        file: path.resolve(process.cwd(), module.output),
        format: 'iife',
        name: key,
        globals: globals,
        sourcemap: sourcemap ? 'inline' : false,
        //  sourcemapPathTransform: getBrowserPriorOption('sourcemapPathTransform')
      }

      rollupConfig.push({
        inputOption,
        outputOption
      })
    }
  }

  return {
    rollupConfig,
    clear,
    copy
  }
}
module.exports = composeConfig