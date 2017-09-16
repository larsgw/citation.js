/**
 * Object containing several RegExp patterns, mostly used for parsing (*full of shame*) and recognizing data types
 *
 * @access protected
 * @constant varRegex
 * @default
 */
const regex = {
  url: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
  bibtxt: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/,
  bibtex: /^(?:\s*@\s*[^@]+?\s*\{\s*[^@]+?\s*,\s*[^@]+\})+\s*$/,
  wikidata: [
    /^\s*(Q\d+)\s*$/,
    /^\s*((?:Q\d+(?:\s+|,|))*Q\d+)\s*$/,
    /^(https?:\/\/(?:www\.)wikidata.org\/w\/api\.php(?:\?.*)?)$/,
    /\/(Q\d+)(?:[#?/]|\s*$)/
  ],
  doi: [
    /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+))\s*$/i,
    /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*$/i,
    /^\s*(?:(?:10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*)+$/i
  ]
}

export default regex
