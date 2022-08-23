const alias = require('@rollup/plugin-alias')
const nodeResolve = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const json = require('@rollup/plugin-json')
const typescript = require('@rollup/plugin-typescript')
const {
  uglify
} = require('rollup-plugin-uglify')
const {
  visualizer
} = require('rollup-plugin-visualizer')

const composeNodeConfig = (config) => {
  const plugins = [
    alias(config.alias),
    typescript(),
    json(),
    nodeResolve(),
    commonjs({
      sourceMap: false
    }),
    replace(config.replace),
    babel({
      exclude: /^(.+\/)?node_modules\/.+$/,
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-transform-runtime', {
          corejs: 2
        }]
      ],
      babelHelpers: 'runtime'
    }),
    uglify(),
    visualizer()
  ]
  const globals = {
    ...defaultGlobals,
    ...config.globals,
  }
  const external = [
    ...defaultExternals,
    ...config.external
  ]
  return {
    plugins,
    globals,
    external
  }
}
module.exports = composeNodeConfig