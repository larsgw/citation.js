import {add} from '../registrar'
import * as modules from './modules'

for (const module in modules) {
  for (const {name, formatter} of modules[module]) {
    add(name, formatter)
  }
}
