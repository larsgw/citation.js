/**
 *
 * @access private
 * @constant bibTxtRegex
 * @default
 */
const bibTxtRegex = {
  splitEntries: /\n\s*(?=\[)/g,
  parseEntry: /^\[(.+?)\]\s*(?:\n([\s\S]+))?$/,
  splitPairs: /((?=.)\s)*\n\s*/g,
  parsePair: /^(.+?)\s*:\s*(.+)$/
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
      const [, key, value] = pair.match(bibTxtRegex.parsePair) || []
      if (key) {
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
 * Format Bib.TXT data
 *
 * @access protected
 * @method parseBibTxt
 *
 * @param {String} src - The input data
 *
 * @return {Array<Object>} Array of BibTeX-JSON
 */
const parseBibTxt = src => src.trim().split(bibTxtRegex.splitEntries).map(parseBibTxtEntry)

export {parseBibTxt as text, parseBibTxtEntry as textEntry}
