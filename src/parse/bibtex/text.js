import varRegex from '../regex'

/**
 * Mapping of BibTeX Escaped Chars to Unicode.
 *
 * From [Zotero's reversed mapping table](https://github.com/zotero/translators/blob/master/BibTeX.js#L2353)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/09/2016
 *
 * @access private
 * @constant varBibTeXTokens
 * @default
 */
import varBibTeXTokens from './tokens.json'

/**
 * Format BibTeX data
 *
 * @access protected
 * @method parseBibTeX
 *
 * @param {String} str - The input data
 *
 * @return {CSL[]} The formatted input data
 */
const parseBibTeX = function (str) {
  let entries

  try {
    entries = []

    const stack = str
        // Clean weird commands
        .replace(/{?(\\[`"'^~=]){?\\?([A-Za-z])}/g, '{$1$2}')
        .replace(/{?(\\[a-z]){?\\?([A-Za-z])}/g, '{$1 $2}')
        // Tokenize, with escaped characters in mind
        .split(new RegExp('(?!^)(' +
          // Escaped chars
          '\\\\([#$%&~_^\\\\{}])|' +
          // Regular commands
          '\\{\\\\(?:' +
          // Accented chars
            // Vowel regular
            '[`\'^~"=][AEIOUYaeiouy]|' +
            // Consonant regular
            '(?:[cv] |[\'])[CcDdGgKkLlNnRrSs]|' +
            // A-E
            '(?:[dkruv] )[Aa]|(?:[db] |\\.)[Bb]|[.^][Cc]|(?:[bd] |\\.)[Dd]|(?:[dkuv] |[.])[Ee]|' +
            // F-J
            '\\.[Ff]|(?:u |[=.^\'])[Gg]|(?:[cd] |[.^"])[Hh]|b h|[dv] [Ii]|=\\\\i|\\.I|(?:v |\\^)[Jj]|' +
            // K-O
            '(?:[bd] |\')[Kk]|[bd] [Ll]|[Ll] |(?:d |[.\'])[Mm]|(?:[bd] |[~.])[Nn]|[dHkuv] [Oo]|' +
            // P-U
            '[.\'][Pp]|(?:[bd] |[.])[Rr]|(?:d |[.^])[Ss]|(?:[bcdv] |[.])[Tt]|" t|[dHkruv] [Uu]|' +
            // V-Z
            '(?:d |[~])[Vv]|(?:d |[`".\'^])[Ww]|r w|[."][Xx]|(?:d |[.])[Yy]|r y|(?:[bdv] |[\'.^])[Zz]|' +
          // No break space
            '~|' +
          // Commands
            '\\w+' +
          ')\\}|' +
          // Greek letters and other symbols
          '\\$\\\\(?:[A-Z]?[a-z]+|\\#|%<)\\\\$|' +
          // Subscript and superscript
          '\\$[^_]\\{[0-9+-=()n]\\}\\$|' +
          // --, ---, '', ''', ``, ```
          '---|--|\'\'\'|\'\'|```|``|' +
          // ?!, !!, !?
          '\\?!|' + '!!|' + '!\\?\'|' +
          // \url and \href
          '\\\\(?:url|href)|' +
          '[\\s\\S]' +
        ')', 'g'))
        .filter(v => !!v)

    const whitespace = varRegex.bibtex[ 1 ]
    const syntax = varRegex.bibtex[ 2 ]
    const dels = {
      '"': '"',
      '{': '}',
      '"{': '}"',
      '{{': '}}',
      '': ''
    }

    let index = 0
    let curs = stack[index]

    while (curs) {
      let obj

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      if (!curs) { break }

      entries.push({type: '', label: '', properties: {}})
      obj = entries[ entries.length - 1 ]

      if (curs === '@') {
        curs = stack[ ++index ]
      } else {
        throw new SyntaxError(`Unexpected token at index ${index}. Expected "@", got "${curs}".`)
      }

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      while ((!whitespace.test(curs) && !syntax.test(curs)) || curs.length > 1) {
        obj.type += curs
        curs = stack[ ++index ]
      }

      obj.type = obj.type.toLowerCase()

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      if (curs === '{') {
        curs = stack[ ++index ]
      } else {
        throw new SyntaxError(`Unexpected token at index ${index}. Expected "{", got "${curs}".`)
      }

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      while ((!whitespace.test(curs) && !syntax.test(curs)) || curs.length > 1) {
        obj.label += curs
        curs = stack[ ++index ]
      }

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      if (curs === ',') {
        curs = stack[ ++index ]
      } else {
        throw new SyntaxError(`Unexpected token at index ${index}. Expected ",", got "${curs}".`)
      }

      while (whitespace.test(curs)) { curs = stack[ ++index ] }

      var
        key,
        val,

        startDel,
        endDel,

        nexs

      while (curs !== '}') {
        key = ''
        val = ''
        startDel = ''

        while (curs && !whitespace.test(curs) && curs !== '=') {
          key += curs
          curs = stack[ ++index ]
        }

        while (whitespace.test(curs)) { curs = stack[ ++index ] }

        if (curs === '=') {
          curs = stack[ ++index ]
        } else {
          throw new SyntaxError(`Unexpected token at index ${index}. Expected "=", got "${curs}".`)
        }

        while (whitespace.test(curs)) { curs = stack[ ++index ] }

        while (syntax.test(curs)) {
          startDel += curs
          curs = stack[ ++index ]
        }

        if (!dels.hasOwnProperty(startDel)) {
          throw new SyntaxError(
            `Unexpected field delimiter at index ${index}. Expected ` +
            `${Object.keys(dels).map(function (v) { return `"${v}"` }).join(', ')}, got "${startDel}".`
          )
        }

        endDel = dels[ startDel ]
        nexs = stack
          .slice(index + 1, index + (endDel.length ? endDel.length : 1))
          .reverse()
          .join('')

        while (curs && (endDel === '' ? curs !== ',' : (curs + nexs) !== endDel)) {
          if (varBibTeXTokens.hasOwnProperty(curs)) {
            val += varBibTeXTokens[ curs ]
          } else if (curs.match(/^\\([#$%&~_^\\{}])$/)) {
            val += curs.slice(1)
          } else if (curs.length > 1) {
            // "Soft", non-breaking error for now
            // throw new SyntaxError( 'Escape sequence not recognized: ' + curs )
            console.error('Escape sequence not recognized: ' + curs)
          } else {
            val += curs
          }

          curs = stack[ ++index ]
          nexs = stack
            .slice(index + 1, index + (endDel.length ? endDel.length : 1))
            .reverse()
            .join('')
        }

        key = key
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase()

        val = val
          .replace(/[{}]/g, '')
          .trim()
          .replace(/\s+/g, ' ')

        obj.properties[ key ] = val

        endDel = endDel.split('')

        while (endDel.pop()) { curs = stack[ ++index ] }

        while (whitespace.test(curs)) { curs = stack[ ++index ] }

        if (curs === '}') {
          break
        } else if (curs === ',') {
          curs = stack[ ++index ]
        } else {
          throw new SyntaxError(`Unexpected token at index ${index}. Expected ",", "}", got "${curs}".`)
        }

        while (whitespace.test(curs)) { curs = stack[ ++index ] }
      }

      if (curs === '}') {
        curs = stack[ ++index ]
      } else {
        throw new SyntaxError(`Unexpected token at index ${index}. Expected "}", got "${curs}".`)
      }
    }

    return entries
  } catch (e) {
    console.error(`Uncaught SyntaxError: ${e.message} Returning completed entries.`)

    // Remove last, incomplete entry
    entries.pop()

    return entries
  }
}

export default parseBibTeX
