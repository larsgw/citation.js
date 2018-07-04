import * as input from '../parse/interface/register'
import * as output from '../get/registrar'

const registers = {
  input,
  output
}

const indices = {}

export const add = (ref, plugins) => {
  let mainIndex = indices[ref] = {}
  console.log(ref, Object.keys(plugins))

  for (let type in plugins) {
    let typeIndex = mainIndex[type] = {}
    let typePlugins = plugins[type]

    for (let name in typePlugins) {
      let typePlugin = typePlugins[name]

      typeIndex[name] = true
      registers[type].add(name, typePlugin)
    }
  }
}

export const remove = (ref) => {
  let mainIndex = indices[ref]

  for (let type in mainIndex) {
    let typeIndex = mainIndex[type]

    for (let name in typeIndex) {
      registers[type].remove(name)
    }
  }

  delete indices[ref]
}

export const has = (ref) => ref in indices
export const list = () => Object.keys(indices)

export {registers}
