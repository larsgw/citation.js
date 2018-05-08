/**
 * @module input/bibtex
 */

/**
 * @access private
 * @constant bibTxtRegex
 * @default
 */
const bibTxtRegex = {
  splitEntries: /\n\s*(?=\[)/g,
  parseEntry: /^\[(.+?)\]\s*(?:\n([\s\S]+))?$/,
  splitPairs: /((?=.)\s)*\n\s*/g,
  splitPair: /:(.*)/
}

/**
 * Parse single Bib.TXT entry
 *
 * @access protected
 * @method parseBibTxtEntry
 *
 * @param {String} entry - The input data
 *
 * @return {Object} Array of BibTeX-JSON
 */
const parseBibTxtEntry = entry => {
  const [, label, pairs] = entry.match(bibTxtRegex.parseEntry) || []

  if (!label || !pairs) {
    return {}
  } else {
    const out = {
      type: 'book',
      label,
      properties: {}
    }

    pairs.trim().split(bibTxtRegex.splitPairs).filter(v => v).forEach(pair => {
      let [key, value] = pair.split(bibTxtRegex.splitPair)

      if (value) {
        key = key.trim()
        value = value.trim()

        if (key === 'type') {
          out.type = value
        } else {
          out.properties[key] = value
        }
      }
    })

    return out
  }
}

/**
 * Parse Bib.TXT data
 *
 * @access protected
 * @method parseBibTxt
 *
 * @param {String} src - The input data
 *
 * @return {Array<Object>} Array of BibTeX-JSON
 */
const parseBibTxt = src => src.trim().split(bibTxtRegex.splitEntries).map(parseBibTxtEntry)

export {
  parseBibTxt as parse,
  parseBibTxt as text,
  parseBibTxtEntry as textEntry
}
