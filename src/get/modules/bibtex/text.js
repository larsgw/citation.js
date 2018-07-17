/**
 * @module output/bibtex
 */

import getBibTeXJSON from './json'
import {get as getDict} from '../../dict'

/**
 * Mapping of BibTeX syntax chars to BibTeX Escaped Chars.
 *
 * From [Zotero's alwaysMap object](https://github.com/zotero/translators/blob/master/BibTeX.js#L225)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/20/2016
 *
 * @access private
 * @constant syntaxTokens
 * @default
 */
const syntaxTokens = {
  '|': '{\\textbar}',
  '<': '{\\textless}',
  '>': '{\\textgreater}',
  '~': '{\\textasciitilde}',
  '^': '{\\textasciicircum}',
  '\\': '{\\textbackslash}',
  // See http://tex.stackexchange.com/questions/230750/open-brace-in-bibtex-fields/230754
  '{': '\\{\\vphantom{\\}}',
  '}': '\\vphantom{\\{}\\}'
}

function escapeValue (value) {
  return value.replace(/[|<>~^\\{}]/g, match => syntaxTokens[match])
}

const caseSensitive = ['title']
const bracketMappings = {
  '': '',
  '{': '}',
  '{{': '}}'
}

function wrapInBrackets (prop, value) {
  let delStart = !isNaN(+value) ? '' : caseSensitive.includes(prop) ? '{{' : '{'
  let delEnd = bracketMappings[delStart]
  return delStart + value + delEnd
}

const richTextMappings = {
  'i': '\\textit{',
  'b': '\\textbf{',
  'sc': '\\textsc{',
  'sup': '\\textsuperscript{',
  'sub': '\\textsubscript{',
  'span style="font-variant:small-caps;"': '\\textsc{',
  'span class="nocase"': '{'
}

function serializeRichTextValue (value) {
  let tokens = value.split(/<(\/.*?|i|b|sc|sup|sub|span.*?)>/g)

  // split, so odd values are text and even values are rich text tokens
  tokens = tokens.map((token, index) => {
    if (index % 2 === 0) {
      return escapeValue(token)
    } else if (token in richTextMappings) {
      return richTextMappings[token]
    } else {
      return '}'
    }
  })

  return tokens.join('')
}

const richTextFields = ['title']

function serializeValue (prop, value, dict) {
  if (richTextFields.includes(prop)) {
    value = serializeRichTextValue(value)
  } else {
    value = escapeValue(value)
  }

  return dict.listItem.join(`${prop}=${wrapInBrackets(prop, value)},`)
}

function serializePropertyList (properties, dict) {
  return properties.map(([prop, value]) => serializeValue(prop, value, dict)).join('')
}

function serializeEntry (entry, dict) {
  let {type, label, properties} = getBibTeXJSON(entry)
  properties = serializePropertyList(Object.entries(properties), dict)

  return dict.entry.join(`@${type}{${label},${
    dict.list.join(properties)
  }}`)
}

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibtex
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} BibTeX string
 */
const getBibtex = function (src, dict) {
  let entries = src.map(entry => serializeEntry(entry, dict)).join('')

  return dict.bibliographyContainer.join(entries)
}

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibTeXWrapper
 * @deprecated use the generalised method: {@link module:output/bibtex~getBibtex}
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} BibTeX (HTML) string
 */
const getBibTeXWrapper = function (src, html) {
  const dict = getDict(html ? 'html' : 'text')
  return getBibtex(src, dict)
}

export {getBibtex}
export default getBibTeXWrapper
