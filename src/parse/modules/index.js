import {add as addPlugin} from '../../plugins/'
import * as modules from './modules'

for (const module in modules) {
  const {ref, formats} = modules[module]
  addPlugin(ref, {input: formats})
}
