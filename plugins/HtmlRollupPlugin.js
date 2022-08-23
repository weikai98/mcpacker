const {
  resolve,
  parse,
  dirname,
  basename,
  extname,
  relative
} = require('path')

const fs = require('fs')

const generateScript = (src) => {
  return `<script src='${src}' defer></script>`
}

module.exports = function HtmlRollupPlugin(options) {
  const {
    fileName,
    template
  } = options
  return {
    name: 'HtmlRollupPlugin',
    async generateBundle(options, bundle) {
      const dir = parse(resolve(options.file)).dir
      const fileSrc = relative(dir, options.file)
      const templatePath = resolve(__dirname, template)
      const assetSource = fs.readFileSync(templatePath, {
        encoding: 'utf-8'
      })
      // assetSource
      const source = assetSource.replace(/(?=<\/head>)/, () => {
        return generateScript(fileSrc)
      })
      this.emitFile({
        type: 'asset',
        fileName: fileName,
        source
      })
    }
  }
}