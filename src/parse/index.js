import * as input from './input/index'
// import * as wikidata from './modules/wikidata/index'
// import * as bibtex from './modules/bibtex/index'
// import * as bibtxt from './modules/bibtex/bibtxt'
// import * as doi from './modules/doi/index'
// import bibjson from './modules/bibjson/index'
import date from './date'
import name from './name'
import json from './json'

import './modules/'

// export {wikidata, bibtex, bibtxt, doi, bibjson, date, name, json, input}
export {date, name, json, input}
export {default as csl} from './csl'
export * from './register'
