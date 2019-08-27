/* eslint-env mocha */

const dictInterfaceSpec = {
  add: 'function',
  get: 'function',
  has: 'function',
  list: 'function',
  remove: 'function',
  register: 'object',
  htmlDict: 'object',
  textDict: 'object'
}

const parsingInterfaceSpec = {
  chain: 'function',
  chainAsync: 'function',
  chainLink: 'function',
  chainLinkAsync: 'function',

  data: 'function',
  dataAsync: 'function',
  type: 'function'
}

const inputInterfaceSpec = Object.assign({}, parsingInterfaceSpec, {
  add: 'function',
  has: 'function',
  get: 'function',
  list: 'function',
  remove: 'function',

  addDataParser: 'function',
  hasDataParser: 'function',
  listDataParser: 'function',
  removeDataParser: 'function',

  addTypeParser: 'function',
  hasTypeParser: 'function',
  listTypeParser: 'function',
  removeTypeParser: 'function',
  treeTypeParser: 'function',

  typeMatcher: 'object',
  util: {
    DataParser: 'function',
    FormatParser: 'function',
    TypeParser: 'function',
    applyGraph: 'function',
    dataTypeOf: 'function',
    removeGraph: 'function',
    typeOf: 'function'
  }
})

const outputInterfaceSpec = {
  add: 'function',
  format: 'function',
  has: 'function',
  list: 'function',
  remove: 'function',
  register: 'object'
}

const staticSpec = {
  async: 'function',
  input: 'function',
  inputAsync: 'function',
  validateOptions: 'function',
  validateOutputOptions: 'function',

  CSL: {
    engine: 'function',
    item: 'function',
    locale: 'function',
    style: 'function',
    register: {
      addLocale: 'function',
      getLocale: 'function',
      hasLocale: 'function',
      addTemplate: 'function',
      getTemplate: 'function',
      hasTemplate: 'function'
    }
  },

  get: Object.assign({}, outputInterfaceSpec, {
    dict: dictInterfaceSpec,

    bibtex: {
      json: 'function',
      label: 'function',
      text: 'function',
      type: 'function'
    },
    bibtxt: 'function',
    json: 'function',
    label: 'function',

    date: 'function',
    name: 'function'
  }),
  parse: Object.assign({}, inputInterfaceSpec, {
    input: Object.assign({}, parsingInterfaceSpec, {
      async: {
        chain: 'function',
        chainLink: 'function',
        data: 'function'
      }
    }),
    csl: 'function',

    bibjson: 'function',
    bibtex: {
      json: 'function',
      prop: 'function',
      text: 'function',
      type: 'function'
    },
    bibtxt: {
      text: 'function',
      textEntry: 'function'
    },
    doi: {
      api: 'function',
      id: 'function',
      async: {
        api: 'function'
      }
    },
    json: 'function',
    wikidata: {
      json: 'function',
      list: 'function',
      prop: 'function',
      type: 'function',
      async: {
        json: 'function',
        prop: 'function'
      }
    },

    date: 'function',
    name: 'function'
  }),

  plugins: {
    add: 'function',
    has: 'function',
    list: 'function',
    remove: 'function',
    config: {
      add: 'function',
      get: 'function',
      remove: 'function'
    },
    dict: dictInterfaceSpec,
    input: inputInterfaceSpec,
    output: outputInterfaceSpec
  },

  util: {
    Register: 'function',
    TokenStack: 'function',
    Translator: 'function',
    deepCopy: 'function',
    fetchFile: 'function',
    fetchFileAsync: 'function',
    setUserAgent: 'function',
    fetchId: 'function',
    attr: {
      getAttributedEntry: 'function',
      getPrefixedEntry: 'function',
      getWrappedEntry: 'function'
    }
  },

  version: 'object'
}

const assert = require('assert')
const Cite = require('..')

function testTree (tree, spec, stack = []) {
  const keys = new Set(Object.keys(tree))
  for (let key in spec) {
    const isLeaf = typeof spec[key] === 'string'
    if (isLeaf || !keys.has(key)) {
      it(key, function () {
        assert.strictEqual(typeof tree[key], spec[key], 'value matches')
      })
    } else {
      describe(key, function () {
        testTree(tree[key], spec[key], stack.concat(key))
      })
    }
    keys.delete(key)
  }
  it('other', function () {
    assert.deepStrictEqual(Array.from(keys), [], 'no excess keys')
  })
}

describe('Cite', function () {
  testTree(Cite, staticSpec)
  describe('prototype', function () {

  })
})
