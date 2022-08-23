import rollupConfig from "./rollup.common.config"
import server from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import eslint from '@rollup/plugin-eslint'


const devConfig = rollupConfig.map(v => {
  v.plugins.push(
    ...[
      // eslint({
      //   throwOnError: true
      // }),
      server({
        contentBase: './dist',
        historyApiFallback: `/__${v.name}.html`,
        port: 5000
      }),
      livereload(),
    ])
  v.output.sourcemap = 'inline'
  return v
})


export default devConfig