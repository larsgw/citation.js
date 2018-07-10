/**
 * @namespace dict
 * @memberof Cite.plugins
 */

import Register from '../util/register'

/**
 * @typedef Cite.plugins.dict~dictName
 * @type String
 */

/**
 * @typedef Cite.plugins.dict~dict
 * @type Object<Cite.plugins.dict~entryName,Cite.plugins.dict~dictEntry>
 */

/**
 * @typedef Cite.plugins.dict~entryName
 * @type String
 */

/**
 * @typedef Cite.plugins.dict~dictEntry
 * @type Array<String>
 */

/**
 * Validate input arguments
 *
 * @access private
 * @memberof Cite.plugins.dict
 *
 * @param {Cite.plugins.dict~dictName} name - output format name
 * @param {Cite.plugins.dict~dict} formatter - outputting function
 * @throw {TypeError} Invalid output format name
 * @throw {TypeError} Invalid formatter
 */
const validate = (name, dict) => {
  if (typeof name !== 'string') {
    throw new TypeError(`Invalid dict name, expected string, got ${typeof name}`)
  } else if (typeof dict !== 'object') {
    throw new TypeError(`Invalid dict, expected object, got ${typeof dict}`)
  }

  for (const entryName in dict) {
    const entry = dict[entryName]
    if (!Array.isArray(entry) || entry.some(part => typeof part !== 'string')) {
      throw new TypeError(`Invalid dict entry "${entryName}", expected array of strings`)
    }
  }
}

/**
 * @access public
 * @memberof Cite.plugins.dict
 * @constant register
 *
 * @type Cite.util.Register
 */
export const register = new Register({
  html: {
    bibliographyContainer: ['<div class="csl-bib-body>', '</div>'],
    entry: ['<div class="csl-entry>', '</div>'],
    list: ['<ul style="list-style-type:none">', '</ul>'],
    listItem: ['<li>', '</li>']
  },
  text: {
    bibliographyContainer: ['', '\n'],
    entry: ['', '\n'],
    list: ['\n', ''],
    listItem: ['\t', '\n']
  }
})

/**
 * Add dictionary to register. Can be used by output plugins.
 *
 * @todo docs
 *
 * @access public
 * @memberof Cite.plugins.dict
 * @method add
 *
 * @param {Cite.plugins.dict~dictName} name - dictionary name
 * @param {Cite.plugins.dict~dict} dict - dictionary data
 * @throw {TypeError} argument validation error
 */
export const add = (name, dict) => {
  validate(name, dict)
  register.set(name, dict)
}

/**
 * Remove dictionary.
 *
 * @access public
 * @memberof Cite.plugins.dict
 * @method remove
 *
 * @param {Cite.plugins.dict~dictName} name - output format name
 */
export const remove = (name) => {
  register.remove(name)
}

/**
 * Check if dictionary plugin exists.
 *
 * @access public
 * @memberof Cite.plugins.dict
 * @method has
 *
 * @param {Cite.plugins.dict~dictName} name - output format name
 * @return {Boolean} register has plugin
 */
export const has = (name) => {
  return register.has(name)
}

/**
 * List dictionary plugins.
 *
 * @access public
 * @memberof Cite.plugins.dict
 * @method list
 *
 * @return {Array<String>} list of plugins
 */
export const list = () => {
  return register.list()
}

/**
 * Get dictionary data.
 *
 * @access public
 * @memberof Cite.plugins.dict
 * @method get
 *
 * @param {Cite.plugins.dict~dictName} name - output format name
 * @return {Cite.plugins.dict~dict} dictionary data
 */
export const get = (name) => {
  if (!register.has(name)) {
    logger.error('[get]', `Dict "${name}" unavailable`)
    return undefined
  }
  return register.get(name)
}

/**
 * Object containing HTML strings for building JSON and BibTeX. Made to match citeproc, for compatibility.
 *
 * @access protected
 * @memberof Cite.plugins.dict
 * @deprecated use the new formatting dicts: {@link Cite.plugins.dict}
 */
export const htmlDict = {
  wr_start: '<div class="csl-bib-body">',
  wr_end: '</div>',
  en_start: '<div class="csl-entry">',
  en_end: '</div>',
  ul_start: '<ul style="list-style-type:none">',
  ul_end: '</ul>',
  li_start: '<li>',
  li_end: '</li>'
}

/**
 * Object containing text strings for building JSON and BibTeX. Made to match citeproc, for compatibility.
 *
 * @access protected
 * @memberof Cite.plugins.dict
 * @deprecated use the new formatting dicts: {@link Cite.plugins.dict}
 */
export const textDict = {
  wr_start: '',
  wr_end: '\n',
  en_start: '',
  en_end: '\n',
  ul_start: '\n',
  ul_end: '',
  li_start: '\t',
  li_end: '\n'
}
