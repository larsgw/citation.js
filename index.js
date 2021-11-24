const core = require('@citation-js/core')

require('@citation-js/plugin-bibjson')
require('@citation-js/plugin-bibtex')
require('@citation-js/plugin-csl')
require('@citation-js/plugin-doi')
require('@citation-js/plugin-ris')
require('@citation-js/plugin-wikidata')

const citeproc = require('citeproc')
const name = require('@citation-js/name')
const date = require('@citation-js/date')

function clone (obj) {
  const copy = {}
  for (const key in obj) {
    copy[key] = typeof obj[key] === 'object' ? clone(obj[key]) : obj[key]
  }
  return copy
}

const attr = {
  getAttributedEntry (string, name, value) {
    return string.replace(/^\s*<[a-z]+/i, `$& data-${name}="${value}"`)
  },
  getPrefixedEntry (value, id) {
    return attr.getAttributedEntry(value, 'csl-entry-id', id)
  },
  getWrappedEntry (value, source, affixes) {
    const getAffix = (source, affix) => typeof affix === 'function' ? affix(source) : affix == null ? affix : ''

    if (affixes.prepend == null && affixes.append == null) {
      return value
    }

    const prefix = getAffix(source, affixes.prepend)
    const suffix = getAffix(source, affixes.append)
    let start = ''
    let end = ''
    const match = value.match(/^([^>]+>)([\s\S]+)(<[^<]+)$/i)
    if (match) {
      start = match[1]
      value = match[2]
      end = match[3]
    }

    return start + prefix + value + suffix + end
  }
}

function Cite (data, opts) {
  if (!(this instanceof Cite)) {
    return new Cite(data, opts)
  }

  const self = new core.Cite(data, opts)
  this._options = self._options
  this.log = self.log
  this.data = self.data
}

Cite.prototype = Object.create(core.Cite.prototype)

Cite.async = core.Cite.async
Cite.validateOptions = core.Cite.validateOptions
Cite.validateOutputOptions = core.Cite.validateOutputOptions

Cite.input = core.plugins.input.chain
Cite.inputAsync = core.plugins.input.chainAsync

Cite.util = Object.assign({ attr }, core.util)
Cite.version = {
  cite: core.version,
  citeproc: citeproc.PROCESSOR_VERSION
}

const CSL = core.plugins.config.get('@csl')

Cite.CSL = {
  engine: require('@citation-js/plugin-csl/lib/engines').fetchEngine,
  item (data) {
    return id => data.find(entry => entry.id === id)
  },
  locale (lang) {
    return CSL.styles.get(CSL.styles.has(lang) ? lang : 'en-US')
  },
  style (style) {
    return CSL.templates.get(CSL.templates.has(style) ? style : 'apa')
  },
  register: {
    addTemplate: CSL.templates.add.bind(CSL.templates),
    getTemplate: CSL.templates.get.bind(CSL.templates),
    hasTemplate: CSL.templates.has.bind(CSL.templates),
    addLocale: CSL.locales.add.bind(CSL.locales),
    getLocale: CSL.locales.get.bind(CSL.locales),
    hasLocale: CSL.locales.has.bind(CSL.locales)
  }
}

Cite.plugins = clone(core.plugins)
delete Cite.plugins.input.util.clean

Cite.parse = Object.assign({
  input: {
    chain: core.plugins.input.chain,
    chainAsync: core.plugins.input.chainAsync,
    chainLink: core.plugins.input.chainLink,
    chainLinkAsync: core.plugins.input.chainLinkAsync,
    data: core.plugins.input.data,
    dataAsync: core.plugins.input.dataAsync,
    type: core.plugins.input.type,
    async: {
      chain: core.plugins.input.chainAsync,
      chainLink: core.plugins.input.chainLinkAsync,
      data: core.plugins.input.dataAsync
    }
  },
  name: name.parse,
  date: date.parse,
  csl: core.plugins.input.util.clean,

  bibjson: require('@citation-js/plugin-bibjson').parsers.json.record,
  bibtex: ((parsers, entries, types) => ({
    json (entries) {
      return entries.parse([].concat(entries))
    },
    prop (field, value) {
      const parsed = entries.parse([{
        type: 'book',
        properties: { [field]: value }
      }])[0]
      const key = Object.keys(parsed).find(([key]) => key !== 'type')
      return [key, parsed[key]]
    },
    text (file) {
      return parsers['@biblatex/text'].parse(file)
    },
    type (type) {
      return types[type] || 'book'
    }
  }))(
    require('@citation-js/plugin-bibtex/lib/input').formats,
    require('@citation-js/plugin-bibtex/lib/input/entries'),
    require('@citation-js/plugin-bibtex/lib/mapping/bibtexTypes').target
  ),
  bibtxt: ((bibtxt) => ({
    text: bibtxt.parse,
    textEntry: bibtxt.textEntry
  }))(require('@citation-js/plugin-bibtex/lib/input/bibtxt')),
  doi: ((doi) => ({
    api: doi.parsers.api.parse,
    id: doi.parsers.id.parse,
    async: {
      api: doi.parsers.api.parseAsync
    }
  }))(require('@citation-js/plugin-doi')),
  json: require('@citation-js/core/lib/plugin-common/input').parsers.json.parse,
  wikidata: ((wikidata) => ({
    json: wikidata.parsers.entity.parse,
    list: wikidata.parsers.id.parse,
    prop: wikidata.parsers.prop.parse,
    type: wikidata.parsers.prop.parseType,
    async: {
      json: wikidata.parsers.entity.parseAsync,
      prop (...args) {
        return Promise.resolve(wikidata.parsers.prop.parse.apply(this, args))
      }
    }
  }))(require('@citation-js/plugin-wikidata'))
}, Cite.plugins.input)

Cite.get = Object.assign({
  dict: Cite.plugins.dict,

  name: name.format,
  date: date.format,

  bibtex: ((formatters, entries, converters, types) => ({
    json (entry) {
      return entries.formatBibtex([entry])[0]
    },
    label ({ id, 'citation-label': label, author, issued, 'year-suffix': suffix, title }) {
      return converters.LABEL.toSource(id, label, author, issued, suffix, title)
    },
    text (entries, asHtml) {
      return formatters.bibtex(entries, { format: asHtml ? 'html' : 'text' })
    },
    type (type) {
      return types[type] || 'misc'
    }
  }))(
    require('@citation-js/plugin-bibtex/lib/output').default,
    require('@citation-js/plugin-bibtex/lib/output/entries'),
    require('@citation-js/plugin-bibtex/lib/mapping/shared').Converters,
    require('@citation-js/plugin-bibtex/lib/mapping/bibtexTypes').target
  ),
  bibtxt: require('@citation-js/plugin-bibtex/lib/output/bibtxt').format,
  json: require('@citation-js/core/lib/plugin-common/output').default.data,
  label: require('@citation-js/core/lib/plugin-common/output').default.label
}, Cite.plugins.output)

module.exports = Cite
