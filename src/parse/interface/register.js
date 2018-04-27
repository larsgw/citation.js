import {FormatParser} from './parser'
import {addTypeParser, removeTypeParser} from './type'
import {addDataParser, removeDataParser} from './data'

// ============================================================================
// Type definitions
// ============================================================================

/**
 * @typedef Cite.plugins.input~format
 * @type String
 */

/**
 * @typedef Cite.plugins.input~parser
 * @type Object
 *
 * @property {Cite.plugins.input~parse} data
 * @property {Cite.plugins.input~parseAsync} dataAsync
 * @property {Cite.plugins.input~typeParser|Cite.plugins.input~predicate|RegExp} type
 */

/**
 * @callback Cite.plugins.input~parse
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @async
 * @callback Cite.plugins.input~parseAsync
 * @param {InputData} input
 * @return parsed data
 */

/**
 * @typedef Cite.plugins.input~typeParser
 * @type Object
 *
 * @property {Cite.plugins.input~predicate|RegExp} predicate
 * @property {Cite.plugins.input~dataType} dataType
 * @property {Cite.plugins.input~propertyConstraint|Array<Cite.plugins.input~propertyConstraint>} propertyConstraint
 * @property {Cite.plugins.input~elementConstraint|Array<Cite.plugins.input~elementConstraint>} elementConstraint
 * @property {Cite.plugins.input~format|Array<Cite.plugins.input~format>} extends
 */

/**
 * @callback Cite.plugins.input~predicate
 * @param {InputData} input
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.plugins.input~dataType
 * @type String
 */

/**
 * @typedef Cite.plugins.input~propertyConstraint
 * @type Object
 * @property {String|Array<String>} [props=[]]
 * @property {String} [match='every']
 * @property {Cite.plugins.input~valuePredicate} [value]
 */

/**
 * @callback Cite.plugins.input~valuePredicate
 * @param value
 * @return {Boolean} pass
 */

/**
 * @typedef Cite.plugins.input~elementConstraint
 * @type Cite.plugins.input~format
 */

// ============================================================================
// Interface
// ============================================================================

const formats = {}

/**
 * See the relevant tutorial: {@tutorial input_plugins}
 *
 * @access public
 * @memberof Cite.plugins.input
 *
 * @param {Cite.plugins.input~format} format - input format name
 * @param {Cite.plugins.input~parserObject} parsers - parsers
 *
 * @tutorial input_plugins
 */
export const addFormat = (format, parsers, pluginRef) => {
  let formatParser = new FormatParser(format, parsers)
  formatParser.validate()

  if (!formats[format]) {
    formats[format] = {}
  }

  if (formatParser.typeParser) {
    addTypeParser(format, formatParser.typeParser)
    formats[format].typeParser = pluginRef
  }
  if (formatParser.dataParser) {
    addDataParser(format, formatParser.dataParser)
    formats[format].dataParser = pluginRef
  }
  if (formatParser.asyncDataParser) {
    addDataParser(format, formatParser.asyncDataParser)
    formats[format].asyncDataParser = pluginRef
  }
}

export const removeFormat = (format, pluginRef) => {
  const parsers = formats[format]
  if (!parsers) {
    return
  }

  // TODO refactor into proper code
  const totalRefs = Object.values(parsers)
  const deletedRefs = totalRefs.filter(ref => pluginRef == null || ref === pluginRef)

  if (pluginRef == null || parsers.typeParser === pluginRef) {
    delete parsers.typeParser
    removeTypeParser(format)
  }
  if (pluginRef == null || parsers.dataParser === pluginRef) {
    delete parsers.dataParser
    removeDataParser(format)
  }
  if (pluginRef == null || parsers.asyncDataParser === pluginRef) {
    delete parsers.asyncDataParser
    removeDataParser(format, true)
  }

  if (deletedRefs.length === totalRefs.length) {
    delete formats[format]
  }
}

export const hasFormat = (format) => format in formats
export const listFormat = () => Object.keys(formats)

// BEGIN compat
export const add = (...args) => {
  logger.warn('This method is deprecated; use addFormat')
  return addFormat(...args)
}
// END compat

const plugins = {}

export const addPlugin = (ref, plugin, config) => {
  plugins[ref] = config
  for (let format in plugin) {
    exports.addFormat(format, plugin[format], ref)
  }
}

export const removePlugin = (ref) => {
  delete plugins[ref]
  for (let format in formats) {
    if (Object.values(formats[format]).includes(ref)) {
      exports.removeFormat(format, ref)
    }
  }
}

export const hasPlugin = (ref) => ref in plugins
export const listPlugin = () => Object.keys(plugins)
