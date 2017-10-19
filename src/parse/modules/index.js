import {add} from '../registrar/'
import './native'
import * as modules from './modules'

for (const module in modules) {
  const {types, parsers} = modules[module]

  for (const type in types) {
    add(type, types[type])
  }

  for (const parser in parsers) {
    const {types, parse, parseAsync} = parsers[parser]
    ;[].concat(types).forEach(type => add(type, {parse, parseAsync}))
  }
}
