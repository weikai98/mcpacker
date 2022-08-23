import path from 'path'
import HtmlRollupPlugin from '../plugins/HtmlRollupPlugin'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import atImport from 'postcss-import'

/**
 *  1. 减少打包文件的数量
    2. 减少不必要的执行函数
    3. 增加打包缓存，进行增量打包
    4. 由单线程变为多线程
 */

const inputPath = [
  {
    name: '1. iife',
    format: 'iife'
  }
]

const rollupConfig = {
  name,
  input: path.resolve(__dirname, `../src/${name}/index.js`),
  output: {
    file: path.resolve(__dirname, `../dist/${name}.js`),
    format,
    globals: {
      vue: 'Vue',
      dayjs: 'dayjs'
    }
  },
  external: ['vue', 'dayjs', /@babel\/runtime/],
  plugins: [
    // 'vue': require.resolve('vue/dist/vue.esm.js'),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, '../src/')
        }
        // {
        //   find: 'vue',
        //   replacement: path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js')
        // }
      ]
    }),
    typescript(),
    vue({
      css: false,
      needMap: false
    }),
    /**
     *  1. rollup本身无法处理vue等外部模块的引入， 需要安装并引入 @rollup/plugin-node-resolve插件。
        2. vue源码中多处用到环境变量， 执行process.env.NODE_ENV操作时会报错并提示process为undefined，
           安装并引入 @rollup/plugin-replace插件可以在编译代码时将process.env.NODE_ENV等环境变量替换为具体值。
        3. 环境变量__VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__如果不进行初始化会报警告， 可更具自身需要对其进行配置。
        4. dayjs 这种非 esm 模块需要通过 @rollup/plugin-commonjs 转换
        */
    json(),
    postcss({
      use: [
        [
          'less',
          {
            plugins: [
              // atImport({
              //   path: ["src/"],
              // })
            ]
          }
        ]
      ]
    }),
    nodeResolve(),
    commonjs({
      sourceMap: false
    }),
    replace({
      preventAssignment: true, // 防止环境变量在代码中被修改
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      )
    }),
    babel({
      exclude: /^(.+\/)?node_modules\/.+$/,
      presets: ['@babel/preset-env'],
      plugins: [['@babel/plugin-transform-runtime', { corejs: 2 }]],
      babelHelpers: 'runtime'
    }),
    HtmlRollupPlugin({
      fileName: `__${name}.html`,
      template: '../template/index.html'
    })
  ]
}

export default rollupConfig
