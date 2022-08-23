const path = require('path')
const defaultGlobals = require('../options/browser-globals.js')
const defaultExternals = require('../options/browser-externals.js')
const HtmlRollupPlugin = require('../../plugins/HtmlRollupPlugin.js')
const vue = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')

const alias = require('@rollup/plugin-alias')
const {
  nodeResolve
} = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const commonjs = require('@rollup/plugin-commonjs')
const {
  babel
} = require('@rollup/plugin-babel')
const json = require('@rollup/plugin-json')
const typescript = require('@rollup/plugin-typescript')

const {
  uglify
} = require('rollup-plugin-uglify')
const {
  visualizer
} = require('rollup-plugin-visualizer')


const composeBrowserConfig = (config) => {
  const plugins = [
    alias(config.alias),
    typescript({
      include: ['**/*'],
      exclude: ['node_modules'],
    }),
    json(),
    vue({
      css: false,
      ...(config.vue || {}),
      needMap: false
    }),
    postcss({
      use: [
        ['less']
      ],
      ...(config.postcss || {})
    }),
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
    HtmlRollupPlugin({
      fileName: `${config.outputHtmlName}.html`,
      template: path.resolve(process.cwd(), config.template)
    }),
    uglify(),
    visualizer()
  ]
  const globals = {
    ...defaultGlobals,
    ...(config.globals || {}),
  }
  const external = [
    ...defaultExternals,
    ...(config.external || [])
  ]
  return {
    plugins,
    globals,
    external
  }
}
module.exports = composeBrowserConfig