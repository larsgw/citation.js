if (process.env.TEST_MOCK_HTTP !== 'false') {
  const mock = require('mock-require')
  const {fetchFile, fetchFileAsync} = require('./api')
  mock('../src/util/fetchFile.js', {default: fetchFile, __esModule: true})
  mock('../src/util/fetchFileAsync.js', {default: fetchFileAsync, __esModule: true})
}

module.exports = require('../src/index')
