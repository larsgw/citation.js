import {addDataParser as add} from '../registrar/data'
import {chain, chainAsync} from '../input/'

const nativeParsers = {
  '@csl/object': input => [input],
  '@csl/list+object': input => input,
  '@else/list+object': input => [].concat(...input.map(chain))
}
const nativeAsyncParsers = {
  '@else/list+object': async input => [].concat(...await Promise.all(input.map(chainAsync)))
}

for (const nativeParser in nativeParsers) {
  add(nativeParser, nativeParsers[nativeParser], {async: false, native: true})
}

for (const nativeAsyncParser in nativeAsyncParsers) {
  add(nativeAsyncParser, nativeAsyncParsers[nativeAsyncParser], {async: true, native: true})
}
