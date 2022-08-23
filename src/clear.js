const path = require('path')
const pkg = require('fs-extra')

const clear = (paths) => {
  paths.forEach(p => {
    const clearPath = path.resolve(process.cwd(), p)
    if (pkg.existsSync(clearPath)) {
      pkg.removeSync(clearPath)
      console.log('%c [ 清除成功 ]-15', 'font-size:13px; background:pink; color:#bf2c9f;')
    }
  })
}
module.exports = clear