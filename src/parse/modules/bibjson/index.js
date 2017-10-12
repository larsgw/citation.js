import * as bibjson from './json'

export const scope = '@bibjson'
export const parsers = {bibjson}
export const types = {
  '@bibjson/object': {
    dataType: 'SimpleObject',
    parseType: input => ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(prop => input[prop] && Array.isArray(input[prop].value))
  }
}
