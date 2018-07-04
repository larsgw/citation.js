import {add as addPlugin} from '../../plugins/'
import * as modules from './modules'

for (let name in modules) {
  let module = modules[name]
  addPlugin(name, {output: module})
}
