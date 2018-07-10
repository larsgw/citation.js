import {FormatParser} from './parser'
import {addTypeParser, removeTypeParser} from './type'
import {addDataParser, removeDataParser} from './data'

const formats = {}

/**
 * See the relevant tutorial: {@tutorial input_plugins}
 *
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} format - input format name
 * @param {Cite.plugins.input~parsers} parsers - parsers
 *
 * @tutorial input_plugins
 */
export const add = (format, parsers) => {
  let formatParser = new FormatParser(format, parsers)
  formatParser.validate()

  let index = formats[format] = {}

  if (formatParser.typeParser) {
    addTypeParser(format, formatParser.typeParser)
    index.type = true
  }
  if (formatParser.dataParser) {
    addDataParser(format, formatParser.dataParser)
    index.data = true
  }
  if (formatParser.asyncDataParser) {
    addDataParser(format, formatParser.asyncDataParser)
    index.asyncData = true
  }
}

/**
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} format - input format name
 */
export const remove = (format) => {
  let index = formats[format]

  if (!index) {
    return
  }

  if (index.type) {
    removeTypeParser(format)
  }
  if (index.data) {
    removeDataParser(format)
  }
  if (index.asyncData) {
    removeDataParser(format, true)
  }

  delete formats[format]
}

/**
 * @access public
 * @memberof Cite.plugins.input
 * @param {Cite.plugins.input~format} format - input format name
 * @returns {Boolean} input format is registered
 */
export const has = (format) => format in formats

/**
 * @access public
 * @memberof Cite.plugins.input
 * @returns {Array<Cite.plugins.input~format>} input format is registered
 */
export const list = () => Object.keys(formats)
