import TokenStack from '../../util/stack'

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
 * Match any BibTeX token.
 *
 *     new RegExp(
 *       // word commands
 *       '\\\\url|\\\\href|' +
 *       '{\\\\[a-zA-Z]+}|\\$\\\\[a-zA-Z]+\\$|' +
 *       // math
 *       '\\$[_^]{[0-9()+\\-=n]}\\$|'+
 *       // symbols
 *       '`{2,3}|\'{2,3}|-{2,3}|[!?]!|!\\?|{\\\\~}|' +
 *       // escaped symbols
 *       '\\\\[#$%&~_^\\\\{}]|' +
 *       // diacritics
 *       '{\\\\(?:[a-z] |[`"\'^~=.])\\\\?[a-zA-Z]}|' +
 *       // non-breaking space
 *       '[\\s\\S]', 'g')
 *
 * @access private
 * @constant tokenPattern
 * @default
 */
const tokenPattern = /\\url|\\href|{\\[a-zA-Z]+}|\$\\[a-zA-Z]+\$|\$[_^]{[0-9()+=\-n]}\$|`{2,3}|'{2,3}|-{2,3}|[!?]!|!\?|{\\~}|\\[#$%&~_^\\{}]|{\\(?:[a-z] |[`"'^~=.])\\?[a-zA-Z]}|[\s\S]/g

const whitespace = /^\s$/
const syntax = /^[@{}"=,\\]$/
const delimiters = {
  '"': '"',
  '{': '}',
  '': ''
}

/**
 * Tokenize a BibTeX string
 *
 * @access private
 * @method getTokenizedBibtex
 *
 * @param {String} str - Input BibTeX
 *
 * @return {String[]} list of tokens
 */
const getTokenizedBibtex = function (str) {
  // Substitute command of form "\X{X}" into "{\X X}"
  str = str
    .replace(/{?(\\[`"'^~=.]){?\\?([A-Za-z])}/g, '{$1$2}')
    .replace(/{?(\\[a-z]){?\\?([A-Za-z])}/g, '{$1 $2}')

  // Tokenize, with escaped characters in mind
  return str.match(tokenPattern)
}

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
  const entries = []
  const tokens = getTokenizedBibtex(str)
  const stack = new TokenStack(tokens)

  try {
    stack.consume(whitespace)

    while (stack.tokensLeft()) {
      stack.consumeToken('@')
      stack.consume(whitespace)

      const type = stack.consume([whitespace, syntax], {inverse: true}).toLowerCase()

      stack.consume(whitespace)
      stack.consumeToken('{')
      stack.consume(whitespace)

      const label = stack.consume([whitespace, syntax], {inverse: true})

      stack.consume(whitespace)
      stack.consumeToken(',')
      stack.consume(whitespace)

      const properties = {}

      while (stack.tokensLeft()) {
        const key = stack.consume([whitespace, '='], {inverse: true}).toLowerCase()

        stack.consume(whitespace)
        stack.consumeToken('=')
        stack.consume(whitespace)

        const startDelimiter = stack.consume(/^({|"|)$/g)

        if (!delimiters.hasOwnProperty(startDelimiter)) {
          throw new SyntaxError(`Unexpected field delimiter at index ${stack.index}. Expected ` +
            `${Object.keys(delimiters).map(function (v) { return `"${v}"` }).join(', ')}; got "${startDelimiter}"`)
        }

        const endDelimiter = delimiters[startDelimiter]

        const tokenMap = token => {
          if (varBibTeXTokens.hasOwnProperty(token)) {
            return varBibTeXTokens[token]
          } else if (token.match(/^\\[#$%&~_^\\{}]$/)) {
            return token.slice(1)
          } else if (token.length > 1) {
            throw new SyntaxError(`Escape sequence not recognized: ${token}`)
          } else {
            return token
          }
        }

        let openBrackets = 0
        const val = stack.consume((token, index) => {
          if (token === '{') {
            openBrackets++
          }

          if (stack.tokensLeft() < endDelimiter.length) {
            throw new SyntaxError(`Unmatched delimiter at index ${stack.index}: Expected ${endDelimiter}`)
          } else if (!endDelimiter.length) {
            return ![whitespace, syntax].some(rgx => rgx.test(token))
          } else if (token === '}' && openBrackets) {
            openBrackets--
            return true
          } else {
            token = stack.stack.slice(index, index + endDelimiter.length).join('')
            return token !== endDelimiter
          }
        }, {tokenMap})

        properties[key] = val

        stack.consumeN(endDelimiter.length)
        stack.consume(whitespace)

        // Last entry (no trailing comma)
        if (stack.matches('}')) { break }

        stack.consumeToken(',')
        stack.consume(whitespace)

        // Last entry (trailing comma)
        if (stack.matches('}')) { break }
      }

      stack.consumeToken('}')
      stack.consume(whitespace)

      entries.push({type, label, properties})
    }
  } catch (e) {
    console.error(`Uncaught SyntaxError: ${e.message}. Returning completed entries.`)

    // Remove last, possibly incomplete entry
    entries.pop()
  }

  return entries
}

export default parseBibTeX
