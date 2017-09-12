# Changelog

## [Unreleased]

## [0.3.3] - 2017-09-12

## Added
* A lot of Wikidata entry type mappings
* Support for option-less piping stdin -> stdout in the CLI

## Changed
* Greatly improve name parsing
* Wikidata entry type default is now `book` to align with, among other things, BibTeX

## Fixed
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
