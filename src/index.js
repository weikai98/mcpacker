#!/usr/bin/env node

const yargs = require('yargs')
const {
  hideBin
} = require('yargs/helpers')
const rollup = require('rollup');



const loadConfig = require('./load-config.js')
const composeConfig = require('./compose-config.js')
const copy = require('./copy.js')
const clear = require('./clear.js')

const argv = yargs(hideBin(process.argv))
  .option('config', {
    alias: 'c',
    type: 'string',
    description: ''
  })
  .option('watch', {
    alias: 'w',
    type: 'string',
    description: ''
  })
  .parse()




// 读取配置文件
const config = loadConfig(argv.config)

// 生成配置文件
const {
  rollupConfig,
  clear: clearOptions,
  copy: copyOptions
} = composeConfig(config)

// 清除
clear(clearOptions)
// 拷贝
copy(copyOptions)

// rollup打包
async function build() {
  console.log('%c [ argv.watch ]-51', 'font-size:13px; background:pink; color:#bf2c9f;', argv)
  if (argv.watch !== undefined) {
    const watcher = rollup.watch(
      rollupConfig.map(c => ({
        ...c.inputOption,
        output: c.outputOption
      }))
    )
    watcher.on('event', event => {
      console.log('%c [ event ]-54', 'font-size:13px; background:pink; color:#bf2c9f;', event.code)
      console.log('%c [ 打包完成 ]-56', 'font-size:13px; background:pink; color:#bf2c9f;')
    })
  } else {
    for (let i = 0; i < rollupConfig.length; i++) {
      const c = rollupConfig[i];
      try {
        // create a bundle
        const bundle = await rollup.rollup(c.inputOption)
        await bundle.write(c.outputOption)
      } catch (error) {
        // do some error reporting
        console.error(error);
      }
    }
  }

}

build();