# Changelog

## [0.4.0-8] - 2018-07-14

Bug fixes.

### Added
* [meta] Point `unpkg` & `jsdelivr` field to citation.min.js

### Changed
* Update for BibJSON parsing (#32). Including tests & documentation.

### Fixed
* Cite option validation (and tests that broke because of it)
* Handling incomplete dates in output formatters (https://github.com/larsgw/citation.js/issues/53#issuecomment-404995961). It was caused by #139, a fix for #138 of which #127 is part of
* Make a check when polishing API data not fail when a date field is an empty object (#147)
* [meta] Docs index issue (070cf12)

## [0.4.0-7] - 2018-07-12

### Added

* A lot of tests cases regarding input parsing mechanisms (#123)
* General plugin system (#88)
* Alias `type` option to `format` in most output formats
* CSL config is now registered with the general plugin system

### Changed

* Reformed input plugin system (again) (#106)
* The `parseDate` method now has an internal parsing implementation (#127, #138)
* Updated documentation (both in-code JSDoc and guides)

### Testing

* Tests now support HTTP(S) request mocking (#134, #136)
* Added REDOS flagging tools
* Tests for global plugin system

### Fixed

* `@else/url` blocking type recognition (#104)
* `@else/json` type predicate for empty objects:
  ```js
  '{}'     // didn't work
  '{a: 1}' // worked
  '{ }'    // worked as well
  ```
* REDOS (mostly, anyway) (see #107, 7c52beff44b37443b812ee5864733e441e29a812)
* JSON output still being invalid (#143, see also #144)
* [meta] Invalid Babel `browsers` target

## [0.4.0-6] - 2018-07-01

### Fixed
* BibTeX output typo, trying to find the non-existent `url` CSL property, instead of the `URL` one (#153)

## [0.4.0-5] - 2018-06-03

### Fixed
* Webpack error because of browserify-centric setup (#151)

## [0.4.0-4] - 2018-05-19

### Fixed
* DOI bug due to a regression in 0.4.0-3 (dda2360f4d91af1d48e1bf859d784b2bdc694c6d)

## [0.4.0-3] - 2018-05-12

### Added
* RIS output support (#125)

### Refactored
* A lot of the building scripts
* All code uses the util fetchFile(Async) functions, to make testing easier

### Fixed
* Subtle type checking bug in translation scheme parsing code (#128)
* Logging API not supported on Node.js v6 (#124)

## [0.4.0-2] - 2018-05-12

> Was skipped due to publishing the wrong files.

## [0.4.0-1] - 2017-12-31

### Added

* New formatting system w/ plugins (#82)
* `Register` class for general-purpose registers (already used in 4 places) (#115)
* `Cite#format` (a `Cite` formatting method for output plugins)

### Changed

* Modularised most output formatting code
* Adding CSL locales and templates now overwrites existing ones. Previously, it didn't, but there wasn't any way of getting them back anyway
* Generalised formatting functions (there are still backwards-compatible wrappers)
* Expanded output options validation issue error messages
* Deprecated `Cite#get`

### Refactored

* Use ESLint envs instead of listing globals (#114)

### Fixed

* Docs issues (#112)
* CLI ouptut file extensions (#121)
* `Cite.async` behaviour w/ callback & no options (#122)
* Output options validation issues (#120)
* Moved input parsing to actual respective test cases

## [0.4.0-0] - 2017-12-22

### Added
* New parsing system w/ plugins

> This change should be mostly backwards-compatible, although certain workarounds may stop working. If there's an issue, please report it [here](https://github.com/larsgw/citation.js/issues)

* Support for dynamic output types
* Greatly improved docs
* Map namespaces in JSDoc comments
* Add tutorials

### Changed
* `Cite#options()` now doesn't update options when they are invalid
* Improved BibTeX field mappings
* Support month names in BibTeX
* CLI logging now on stderr (instead of stdout)

## [0.3.4] - 2017-09-12

### Changed
* Updated README

### Fixed
* Command sequence normalisation in BibTeX
* BibTeX test case output

## [0.3.3] - 2017-09-12

### Added
* A lot of Wikidata entry type mappings
* Support for option-less piping stdin -> stdout in the CLI

### Changed
* Greatly improve name parsing
* Wikidata entry type default is now `book` to align with, among other things, BibTeX

### Fixed
* Unknown Wikidata entry type now actually defaults to something
* CLI now uses the API changed in 0.3.1

## [0.3.2] - 2017-09-10

### Added
* New Wikidata field mappings (see [#76](https://github.com/larsgw/citation.js/issues/76))

### Changed
* BibTeX name field output now uses reverse notation
* Main parsing function aliases/shortcuts:
  * `Cite.normalise()` -> `Cite.input()`
  * `Cite.normaliseAsync()` -> `Cite.inputAsync()`

## [0.3.1] - 2017-09-02

### Added
* Options parameter in `parseInput` and `parseInputAsync`
* Option for max parsing chain length
* Option to generate parsing chain data in `_graph` property
* Option to force type when parsing

### Changed
* Options API in `Cite` and `Cite.async`

```js
Cite(data, outputOptions)

// BECOMES

Cite(data, {
  ...parsingOptions,
  output: outputOptions
})
```

* Author ordinal in Wikidata props is now a property `_ordinal` instead of an array element
* Parsing invalid dates now returns input as literal date instead of an empty `date-parts`

### Refactored
* Simplify code to normalise CSL-JSON
* Mock APIs for async tests

### Fixed
* Parsing names with lowercase particles now doesn't omit family names
* Better error messaging when API/file requests fails

## [0.3.0] - 2017-08-25

See `0.3.0-14`.

## [0.3.0-14] - 2017-08-24

### Added
* Alias for main parsing functions: `Cite.parse.input.chain -> Cite.normalise` and `Cite.parse.input.async.chain -> Cite.normaliseAsync`
* Async versions of `Cite#set()` and `Cite#add()` (only Promise, no callback)

### Refactored
* Wikidata JSON parsing system

### Fixed
* Wikidata prop parsing function now returns with the proper field name when parsing an author prop

## [0.3.0-13] - 2017-08-22

### Added
* Support for matching several tokens in a row with TokenStack

### Refactored
* Add explanation to complex code
* BibTeX publication type parsing now uses a type map

### Fixed
* Typo in BibTeX de-escaping code, now correctly parsing % signs in author fields
* False positive parsing Array JSON string as Bib.TXT

## [0.3.0-12] - 2017-08-01

### Added
* Support for BibTeX literals in author and date fields
* Support for BibTeX fields year and month

### Changed
* `Cite#retrieveVersion()` now returns `null` on all invalid versions

### Refactored
* Testing now with the mocha framework
* BibTeX parser

### Fixed
* Sorting by any date field

## [0.3.0-11] - 2017-07-28

### Added
* Custom templates & locales register

### Fixed
* Use correct date format

## [0.3.0-10] - 2017-07-28

### Added
* DOI support
* CSL normaliser

### Fixed
* Async prop parsing

## [0.3.0-9] - 2017-07-06

### Added
* CLI stdin input

### Fixed
* DOM HTML output
* CLI non-file input

## [0.3.0-8] - 2017-06-03

### Added
* Iterator to Cite

### Fixed
* CLI Windows support
* Wikidata input when value is empty
* DOM HTML output
* Output JSON is now valid JSON
* Sorting by callback and custom props
* Input support for BibTeX JSON

## [0.3.0-7] - 2017-05-22

### Added
* Bib.TXT i/o support

### Fixed
* CLI Citation.js v0.3.0-7 support

## [0.3.0-6] - 2017-05-15

### Added
* Async support

### Fixed
* Increased browser support

## [0.3.0-5] - 2017-05-08

### Added
* Exposition of most Cite functions to users

### Changed
* Logging non-standard

### Removed
* Remove `Cite#_input`

### Refactored
* Code style and ES6+

## Older changelogs coming later
I really don't recommend using those versions anyway.
