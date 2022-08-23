const path = require('path')
const pkg = require('fs-extra')

const copy = (pathsMap) => {
  Object.keys(pathsMap).forEach(key => {
    const copyInput = path.resolve(process.cwd(), key)
    const copyOutput = path.resolve(process.cwd(), pathsMap[key])
    if (pkg.existsSync(copyInput)) {
      pkg.mkdirsSync(path.parse(copyOutput).dir)
      pkg.copySync(copyInput, copyOutput)
      console.log('%c [ 拷贝成功 ]-15', 'font-size:13px; background:pink; color:#bf2c9f;')
    }
  })
}
module.exports = copy