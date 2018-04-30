import {URL} from 'url'
import wikidata from './data/api/wikidata'
import doi from './data/api/doi'

const createWikidataResponse = function (ids) {
  const response = {entities: {}}
  for (const id of ids) {
    response.entities[id] = wikidata.entities[id]
  }
  return response
}

const createDoiResponse = function (id) {
  return doi[id]
}

const configs = [{
  domain: /^(www\.)?wikidata\.org/,
  path: /^\/w\/api\.php/,
  response ({searchParams}) {
    return JSON.stringify(createWikidataResponse(searchParams.get('ids').split('|')))
  }
}, {
  domain: /^((www|dx)\.)?doi\.org/,
  path: /^\//,
  response ({pathname: path}) {
    return JSON.stringify(createDoiResponse(path.slice(1)))
  }
}]

const mockResponse = function (request, opts) {
  const url = new URL(request)
  const {hostname, pathname: path} = url
  const {response} = configs.find(config => config.domain.test(hostname) && config.path.test(path))
  return response(url)
}

export const fetchFile = function (...args) {
  return mockResponse(...args)
}

export const fetchFileAsync = function (...args) {
  return new Promise((resolve) => resolve(mockResponse(...args)))
}
