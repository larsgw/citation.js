/**
 * @namespace dict
 * @memberof Cite.get
 */

import Register from '../util/register'

/**
 * @typedef Cite.get.dict~dictName
 * @type String
 */

/**
 * @typedef Cite.get.dict~dict
 * @type Object<Cite.get.dict~entryName,Cite.get.dict~dictEntry>
 */

/**
 * @typedef Cite.get.dict~entryName
 * @type String
 */

/**
 * @typedef Cite.get.dict~dictEntry
 * @type Array<String>
 */

/**
 * Validate input arguments
 *
 * @access private
 * @memberof Cite.get.dict
 *
 * @param {Cite.get.dict~dictName} name - output format name
 * @param {Cite.get.dict~dict} formatter - outputting function
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
 * @memberof Cite.get.dict
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
 * @memberof Cite.get.dict
 * @method add
 *
 * @param {Cite.get.dict~dictName} name - dict name
 * @param {Cite.get.dict~dict} dict - dict data
 * @throw {TypeError} argument validation error
 */
export const add = (name, dict) => {
  validate(name, dict)
  register.set(name, dict)
}

/**
 * Remove dict.
 *
 * @access public
 * @memberof Cite.get.dict
 * @method remove
 *
 * @param {Cite.get.dict~dictName} name - output format name
 */
export const remove = (name) => {
  register.remove(name)
}

/**
 * Check if output plugin exists.
 *
 * @access public
 * @memberof Cite.get.dict
 * @method has
 *
 * @param {Cite.get.dict~dictName} name - output format name
 * @return {Boolean} register has plugin
 */
export const has = (name) => {
  return register.has(name)
}

/**
 * List output plugins.
 *
 * @access public
 * @memberof Cite.get.dict
 * @method list
 *
 * @return {Array<String>} list of plugins
 */
export const list = () => {
  return register.list()
}

/**
 * Check if output plugin exists.
 *
 * @access public
 * @memberof Cite.get.dict
 * @method get
 *
 * @param {Cite.get.dict~dictName} name - output format name
 * @return {Boolean} register has plugin
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
 * @memberof Cite.get.dict
 * @deprecated use the new formatting dicts: {@link Cite.get.dict}
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
 * @memberof Cite.get.dict
 * @deprecated use the new formatting dicts: {@link Cite.get.dict}
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
