if (process.env.TEST_MOCK_HTTP !== 'false') {
  const mock = require('mock-require')
  const {fetchFile, fetchFileAsync} = require('./api')
  mock('../src/util/fetchFile.js', {default: fetchFile, __esModule: true})
  mock('../src/util/fetchFileAsync.js', {default: fetchFileAsync, __esModule: true})
} else {
  // start sync-request beforehand (interferes with the reporter otherwise)
  try { require('sync-request')() } catch (e) { }
}

module.exports = require('../src/index')
