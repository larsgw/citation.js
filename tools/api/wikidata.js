/* global fetch */
require('isomorphic-fetch')

var fs = require('fs')
var wdk = require('wikidata-sdk')

var items = ['Q21972834', 'Q27795847']
var props = ['P50', 'P57', 'P86', 'P98', 'P110', 'P655', 'P123', 'P136', 'P291', 'P1433']
var prefix = (array, prefix) => array.map(item => prefix + item).join(' ')
var json = response => response.json()

var query = wdk.sparqlQuery(`select ?item where {
  values ?subject {${prefix(items, 'wd:')}} .
  values ?prop {${prefix(props, 'wdt:')}} .
  ?subject ?prop ?object .
  bind(strAfter(str(?object), str(wd:)) as ?item)
}`)

fetch(query)
  .then(json)
  .then(wdk.simplifySparqlResults)
  .then(results => [].concat(items, results))
  .then(wdk.getManyEntities)
  .then(urls => Promise.all(urls.map(fetch)))
  .then(urls => Promise.all(urls.map(json)))
  .then(results => results.map(result => result.entities))
  .then(results => Object.assign.apply(Object, results))
  .then(results => JSON.stringify({entities: results}, null, 2))
  .then(result => fs.writeFileSync('test/data/api/wikidata.json', result))
