import {addPlugin} from '../interface/register'
import * as modules from './modules'

for (const module in modules) {
  const {ref, formats, config} = modules[module]
  addPlugin(ref, formats, config)
}
