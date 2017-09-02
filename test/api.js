import nock from 'nock'
import wikidata from './wikidata'

const doi = {
  '10.1021/ja01577a030': [{
    'indexed': {
      'date-parts': [[2017, 5, 10]],
      'date-time': '2017-05-10T11:14:56Z',
      'timestamp': 1494414896320
    },
    'reference-count': 0,
    'publisher': 'American Chemical Society (ACS)',
    'issue': '20',
    'content-domain': {
      'domain': [],
      'crossmark-restriction': false
    },
    'short-container-title': ['J. Am. Chem. Soc.'],
    'published-print': {
      'date-parts': [[1957, 10]]
    },
    'DOI': '10.1021/ja01577a030',
    'type': 'journal-article',
    'created': {
      'date-parts': [[2005, 3, 10]],
      'date-time': '2005-03-10T14:51:56Z',
      'timestamp': 1110466316000
    },
    'page': '5441-5444',
    'source': 'Crossref',
    'is-referenced-by-count': 0,
    'title': 'Correlation of the Base Strengths of Amines1',
    'prefix': '10.1021',
    'volume': '79',
    'author': [{
      'suffix': 'Jr.',
      'given': 'H. K.',
      'family': 'Hall',
      'affiliation': []
    }],
    'member': '316',
    'container-title': 'Journal of the American Chemical Society',
    'original-title': [],
    'deposited': {
      'date-parts': [[2016, 9, 7]],
      'date-time': '2016-09-07T14:19:33Z',
      'timestamp': 1473257973000
    },
    'score': 1.0,
    'subtitle': [],
    'short-title': [],
    'issued': {
      'date-parts': [[1957, 10]]
    },
    'references-count': 0,
    'alternative-id': ['10.1021/ja01577a030'],
    'URL': 'http://dx.doi.org/10.1021/ja01577a030',
    'relation': {},
    'ISSN': ['0002-7863', '1520-5126'],
    'issn-type': [{
      'value': '0002-7863',
      'type': 'print'
    }, {
      'value': '1520-5126',
      'type': 'electronic'
    }],
    'subject': ['Colloid and Surface Chemistry', 'Biochemistry', 'Chemistry(all)', 'Catalysis']
  }]
}

const createWikidataResponse = function (id) {
  return {entities: {[id]: wikidata.entities[id]}}
}

const createDoiResponse = function (id) {
  return doi[id]
}

// wrapper to allow arrow functions with 'this'
const f = fun => function (...args) { return fun(this, ...args) }

const configs = {
  wikidata: {
    domain: /^https?:\/\/(www\.)?wikidata\.org/,
    path: '/w/api.php',
    query: ({action, format, ids}) =>
      action === 'wbgetentities' &&
      format === 'json' &&
      /Q\d+(|Q\d+)*/.test(ids),
    response: {
      data: f(({req}) => createWikidataResponse(req.path.match(/[?&]ids=(Q\d+(|Q\d+)*)(&|$)/)[1]))
    }
  },
  doi: {
    domain: /^https?:\/\/((www|dx)\.)?doi\.org/,
    path: /^\//,
    headers: {
      accept: 'application/vnd.citationstyles.csl+json'
    },
    response: {
      data: f(({req}) => createDoiResponse(this.req.path.replace(/^\//, '')))
    }
  }
}

const setUp = function (...apis) {
  apis.forEach(api => {
    const {
      domain = /[\s\S]?/,
      path = /[\s\S]?/,
      headers = {},
      query = {},
      response: {
        code = 201,
        data: reply
      } = {}
    } = configs[api] || api || {}

    nock(domain, {reqheaders: headers}).persist().get(path).query(query).reply(code, reply)
  })
}

export {setUp}
