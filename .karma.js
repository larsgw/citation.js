// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // list of files / patterns to exclude
    exclude: [],


    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'BrowserStack'],
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'build/citation.min.js'},
      {pattern: 'build/test.citation.min.js'}
    ],


    // define browsers
    customLaunchers: {
      bs_chrome_64: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '64.0',
        os: 'Windows',
        os_version: '10'
      },
      bs_ie_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10',
        os: 'Windows',
        os_version: '7'
      },
      bs_ie_8: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '8',
        os: 'Windows',
        os_version: '7'
      }
    },
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['bs_chrome_64', 'bs_ie_10', 'bs_ie_8']
  })
}
