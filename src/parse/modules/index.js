import {addFormat as add} from '../interface/register'
import * as modules from './modules'

for (const module in modules) {
  const {types, parsers} = modules[module]

  for (const type in types) {
    add(type, {parseType: types[type]})
  }

  for (const parser in parsers) {
    const {types, parse, parseAsync} = parsers[parser]
    ;[].concat(types).forEach(type => add(type, {parse, parseAsync}))
  }
}
