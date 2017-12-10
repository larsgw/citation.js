/**
 * @module input/wikidata
 */

export const scope = '@wikidata'
export const types = '@wikidata/url'
export const parse = input => input.match(/\/(Q\d+)(?:[#?/]|\s*$)/)[1]
