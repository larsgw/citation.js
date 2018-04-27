/**
 * @module input/wikidata
 */

export const parse = input => input.match(/\/(Q\d+)(?:[#?/]|\s*$)/)[1]
