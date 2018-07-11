/**
 * @module output/csl
 */

import prepareEngine from './engines'

/**
 * @access protected
 * @method citation
 *
 * @param {Array<CSL>} data
 * @param {Object} [options={}]
 * @param {String} [options.template='apa']
 * @param {String} [options.lang='en-US']
 * @param {String} [options.format='text']
 * @param {String|Array<String>} [options.entry] - list of ids of entries to include in the citation. defaults to all entries
 *
 * @return {String} output
 */
export default function citation (data, options = {}) {
  const {template = 'apa', lang = 'en-US', format = 'text'} = options
  const ids = data.map(({id}) => id)
  const entries = options.entry ? [].concat(options.entry) : ids

  const citeproc = prepareEngine(data, template, lang, format)
  citeproc.updateItems(ids)

  const citation = citeproc.previewCitationCluster({
    citationItems: entries.map(id => ({id})),
    properties: {noteIndex: 0}
  }, [], [], format)

  return citation
}
