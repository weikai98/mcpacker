import rollupConfig from "./rollup.common.config"
import {
  uglify
} from 'rollup-plugin-uglify'
import {
  visualizer
} from 'rollup-plugin-visualizer'

const proConfig = rollupConfig.map(v => {
  v.plugins.push(
    ...[
      uglify(),
      visualizer()
    ]
  )
  return v
})



export default proConfig