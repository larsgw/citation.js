# Changelog

## [`0.4.10`](https://github.com/larsgw/citation.js/compare/v0.4.9...v0.4.10) - 2019-08-27

* Pin component versions to [`v0.4.10`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#0410-2019-08-27):

> ### Bug Fixes
>
> * **plugin-csl:** use global symbol registry (dd8e839)

## [`0.4.9`](https://github.com/larsgw/citation.js/compare/v0.4.8...v0.4.9) - 2019-08-27

* Pin component versions to [`v0.4.9`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#049-2019-08-27):

> ### Bug Fixes
>
> * **core:** cap sync-rpc version ([2157335](https://github.com/citation-js/citation-js/commit/2157335)), closes [#54](https://github.com/citation-js/citation-js/issues/54)
> * **core:** remove Object.entries call ([c38e3b9](https://github.com/citation-js/citation-js/commit/c38e3b9))
> * **core:** remove use of object spread ([d82342a](https://github.com/citation-js/citation-js/commit/d82342a)), closes [#53](https://github.com/citation-js/citation-js/issues/53)
> * **plugin-csl:** defer error to citeproc-js ([0f76fcb](https://github.com/citation-js/citation-js/commit/0f76fcb))
> * **plugin-csl:** only proxy @bibliography/style once ([a372012](https://github.com/citation-js/citation-js/commit/a372012))
> * **plugin-csl:** pass 'this' in getWrapperProxy ([c3e670a](https://github.com/citation-js/citation-js/commit/c3e670a))
> * **plugin-csl:** return proxy in getWrapperProxy ([39e57a3](https://github.com/citation-js/citation-js/commit/39e57a3))
> * **plugin-ris:** fix legacy EP tag ([d7c6ea5](https://github.com/citation-js/citation-js/commit/d7c6ea5))
>
>
> ### Features
>
> * **core:** add match=none to propertyConstraint ([9bafb58](https://github.com/citation-js/citation-js/commit/9bafb58))
> * **core:** add Translator to utils ([0dd4963](https://github.com/citation-js/citation-js/commit/0dd4963))
> * **plugin-ris:** add RIS input support ([1c49bcb](https://github.com/citation-js/citation-js/commit/1c49bcb))

## [`0.4.8`](https://github.com/larsgw/citation.js/compare/v0.4.7...v0.4.8) - 2019-07-06

* Pin component versions to [`v0.4.8`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#048-2019-07-06):

> ### Bug Fixes
>
> * **core:** do not attempt to clone non-standard objects ([5309d08](https://github.com/citation-js/citation-js/commit/5309d08)), closes [#52](https://github.com/citation-js/citation-js/issues/52)
> * **plugin-wikidata:** properly collect id from fetched items ([710a276](https://github.com/citation-js/citation-js/commit/710a276))
>
>
> ### Features
>
> * **core:** use central User-Agent in fetchFile ([3fa8863](https://github.com/citation-js/citation-js/commit/3fa8863)), closes [#39](https://github.com/citation-js/citation-js/issues/39)

## [`0.4.7`](https://github.com/larsgw/citation.js/compare/v0.4.6...v0.4.7) - 2019-06-29

* Pin component versions to [`v0.4.7`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#047-2019-06-29):

> ### Bug Fixes
>
> * **core:** make fetchFile checkResponse optional ([a51a185](https://github.com/citation-js/citation-js/commit/a51a185))
> * **plugin-doi:** use new checkContentType option ([92df863](https://github.com/citation-js/citation-js/commit/92df863))

## [`0.4.6`](https://github.com/larsgw/citation.js/compare/v0.4.5...v0.4.6) - 2019-06-29

* Pin component versions to [`v0.4.6`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#046-2019-06-28):

> ### Bug Fixes
>
> * **core:** check if fetchFile response matches request ([e9f9132](https://github.com/citation-js/citation-js/commit/e9f9132)), closes [#36](https://github.com/citation-js/citation-js/issues/36)
> * **core:** fix getBody in fetchFile ([e4247da](https://github.com/citation-js/citation-js/commit/e4247da))
> * **core:** remove console.log call ([e0b1790](https://github.com/citation-js/citation-js/commit/e0b1790))
> * **plugin-wikidata:** fix typo ([8916446](https://github.com/citation-js/citation-js/commit/8916446))
>
>
> ### Features
>
> * **core:** support POST in fetchFile ([ece8a2d](https://github.com/citation-js/citation-js/commit/ece8a2d))

## [`0.4.5`](https://github.com/larsgw/citation.js/compare/v0.4.4...v0.4.5) - 2019-06-13

* Pin component versions to [`v0.4.5`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#045-2019-06-12):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix parsing of name lists ([11d7dd7](https://github.com/citation-js/citation-js/commit/11d7dd7))
> * **plugin-bibtex:** fix safe labels for unicode names ([8167958](https://github.com/citation-js/citation-js/commit/8167958))
> * **plugin-bibtex:** safe author name ([a232fe7](https://github.com/citation-js/citation-js/commit/a232fe7))
> * **plugin-bibtex:** strip unknown commands in input ([5b3508e](https://github.com/citation-js/citation-js/commit/5b3508e))
> * **plugin-wikidata:** exclude emoji flags as country names ([73b0e84](https://github.com/citation-js/citation-js/commit/73b0e84))
> * **plugin-wikidata:** fix cache fetching ([63a4f0d](https://github.com/citation-js/citation-js/commit/63a4f0d)), closes [#41](https://github.com/citation-js/citation-js/issues/41)
> * **plugin-wikidata:** fix country name check ([90d1c07](https://github.com/citation-js/citation-js/commit/90d1c07))
>
>
> ### Features
>
> * **cli:** add --plugins option ([229c95c](https://github.com/citation-js/citation-js/commit/229c95c)), closes [#40](https://github.com/citation-js/citation-js/issues/40)
> * **cli:** plugin config & format options ([8bd2a4a](https://github.com/citation-js/citation-js/commit/8bd2a4a))
> * **cli:** support for input options ([87d8eb5](https://github.com/citation-js/citation-js/commit/87d8eb5))
> * **plugin-bibtex:** add generateLabel option ([d10631c](https://github.com/citation-js/citation-js/commit/d10631c))
>
>
> ### BREAKING CHANGES
>
> * **plugin-bibtex:** strips unkown commands entirely instead of replacing
> the braces with no-case tags

## [`0.4.4`](https://github.com/larsgw/citation.js/compare/v0.4.2...v0.4.4) - 2019-06-13

* Pin component versions to [`v0.4.4`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#044-2019-05-24):

> * **plugin-wikidata:** additional mappings ([01be936](https://github.com/citation-js/citation-js/commit/01be936)), closes [#18](https://github.com/citation-js/citation-js/issues/18)

## [`0.4.2`](https://github.com/larsgw/citation.js/compare/v0.4.1...v0.4.2) - 2019-06-13

* Pin component versions to [`v0.4.2`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#042-2019-04-26):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix label creation ([c7cde40](https://github.com/citation-js/citation-js/commit/c7cde40)), closes [#35](https://github.com/citation-js/citation-js/issues/35)
> * **plugin-wikidata:** support imprecise dates ([c898db7](https://github.com/citation-js/citation-js/commit/c898db7)), closes [#33](https://github.com/citation-js/citation-js/issues/33)
>
>
> ### Features
>
> * **plugin-wikidata:** support more URL properties ([#34](https://github.com/citation-js/citation-js/issues/34)) ([d489843](https://github.com/citation-js/citation-js/commit/d489843))

## [`0.4.1`](https://github.com/larsgw/citation.js/compare/v0.4.0...v0.4.1) - 2019-06-13

Pin component versions to [`v0.4.1`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#041-2019-04-14):

> * **plugin-wikidata:** fix getting label if no title exists ([#32](https://github.com/citation-js/citation-js/issues/32)) ([69243c5](https://github.com/citation-js/citation-js/commit/69243c5))

## [`0.4.0`](https://github.com/larsgw/citation.js/compare/v0.4.0-12...v0.4.0) - 2019-04-13

Updated components to `v0.4.0`, release `v0.4`.

## [`0.4.0-12`](https://github.com/larsgw/citation.js/compare/v0.4.0-11...v0.4.0-12) - 2019-03-17

Updated components from `v0.4.0-rc.1` to `v0.4.0-rc.4`, see [that changelog](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md).

## [`0.4.0-11`](https://github.com/larsgw/citation.js/compare/v0.4.0-10...v0.4.0-11) - 2018-12-27

### BREAKING

* Moved all code to '@citation-js' components. There should be full backwards compatibility, apart from the structure of files.

## [`0.4.0-10`](https://github.com/larsgw/citation.js/compare/v0.4.0-9...v0.4.0-10) - 2018-11-02

### Added

* [meta] More test work
* `util.Register`: Alias `remove` to `delete`
* `input/@wikidata`: Support 'stated as' (P1932) qualifier, if possible preferring that over fetching author labels (#131)
* `output/@csl`: Bibliography `nosort` option
* `input/@bibtex`: Support for comma-delimited entries (#157)

### Changed

* Deprecated wrapper CSL locale and template methods

### Fixed

* `output/@csl`: Affixes now work reliably for all formats (#84)

## [`0.4.0-9`](https://github.com/larsgw/citation.js/compare/v0.4.0-8...v0.4.0-9) - 2018-07-19

### Added
* Support for styled text in title fields in BibTeX input (see #150). Values wrapped in double brackets are treated as values wrapped in single brackets (see #155)

### Changed
* BibTeX title fields are no longer wrapped in double brackets when creating output (#155)

### Fixed
* Handling of styled text in CSL-JSON title fields when creating BibTeX output (#150)
* Bug introduced when fixing REDOS that made the @else/url type not match @wikidata/api in some cases (#156)

## [`0.4.0-8`](https://github.com/larsgw/citation.js/compare/v0.4.0-7...v0.4.0-8) - 2018-07-14

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

## [`0.4.0-7`](https://github.com/larsgw/citation.js/compare/v0.4.0-6...v0.4.0-7) - 2018-07-12

### Added

* [meta] A lot of tests cases regarding input parsing mechanisms (#123)
* General plugin system (#88)
* Alias `type` option to `format` in most output formats
* CSL config is now registered with the general plugin system
* CSL `citation` support (see #148)

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

## [`0.4.0-6`](https://github.com/larsgw/citation.js/compare/v0.4.0-5...v0.4.0-6) - 2018-07-01

### Fixed
* BibTeX output typo, trying to find the non-existent `url` CSL property, instead of the `URL` one (#153)

## [`0.4.0-5`](https://github.com/larsgw/citation.js/compare/v0.4.0-4...v0.4.0-5) - 2018-06-03

### Fixed
* Webpack error because of browserify-centric setup (#151)

## [`0.4.0-4`](https://github.com/larsgw/citation.js/compare/v0.4.0-3...v0.4.0-4) - 2018-05-19

### Fixed
* DOI bug due to a regression in 0.4.0-3 (dda2360f4d91af1d48e1bf859d784b2bdc694c6d)

## [`0.4.0-3`](https://github.com/larsgw/citation.js/compare/v0.4.0-2...v0.4.0-3) - 2018-05-12

### Added
* RIS output support (#125)

### Refactored
* A lot of the building scripts
* All code uses the util fetchFile(Async) functions, to make testing easier

### Fixed
* Subtle type checking bug in translation scheme parsing code (#128)
* Logging API not supported on Node.js v6 (#124)

## [`0.4.0-2`](https://github.com/larsgw/citation.js/compare/v0.4.0-1...v0.4.0-2) - 2018-05-12

> Was skipped due to publishing the wrong files.

## [`0.4.0-1`](https://github.com/larsgw/citation.js/compare/v0.4.0-0...v0.4.0-1) - 2017-12-31

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

## [`0.4.0-0`](https://github.com/larsgw/citation.js/compare/v0.3.4...v0.4.0-0) - 2017-12-22

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

## [`0.3.4`](https://github.com/larsgw/citation.js/compare/v0.3.3...v0.3.4) - 2017-09-12

### Changed
* Updated README

### Fixed
* Command sequence normalisation in BibTeX
* BibTeX test case output

## [`0.3.3`](https://github.com/larsgw/citation.js/compare/v0.3.2...v0.3.3) - 2017-09-12

### Added
* A lot of Wikidata entry type mappings
* Support for option-less piping stdin -> stdout in the CLI

### Changed
* Greatly improve name parsing
* Wikidata entry type default is now `book` to align with, among other things, BibTeX

### Fixed
* Unknown Wikidata entry type now actually defaults to something
* CLI now uses the API changed in 0.3.1

## [`0.3.2`](https://github.com/larsgw/citation.js/compare/v0.3.1...v0.3.2) - 2017-09-10

### Added
* New Wikidata field mappings (see [#76](https://github.com/larsgw/citation.js/issues/76))

### Changed
* BibTeX name field output now uses reverse notation
* Main parsing function aliases/shortcuts:
  * `Cite.normalise()` -> `Cite.input()`
  * `Cite.normaliseAsync()` -> `Cite.inputAsync()`

## [`0.3.1`](https://github.com/larsgw/citation.js/compare/v0.3.0...v0.3.1) - 2017-09-02

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

## [`0.3.0`](https://github.com/larsgw/citation.js/compare/v0.3.0-14...v0.3.0) - 2017-08-25

See `0.3.0-14`.

## [`0.3.0-14`](https://github.com/larsgw/citation.js/compare/v0.3.0-13...v0.3.0-14) - 2017-08-24

### Added
* Alias for main parsing functions: `Cite.parse.input.chain -> Cite.normalise` and `Cite.parse.input.async.chain -> Cite.normaliseAsync`
* Async versions of `Cite#set()` and `Cite#add()` (only Promise, no callback)

### Refactored
* Wikidata JSON parsing system

### Fixed
* Wikidata prop parsing function now returns with the proper field name when parsing an author prop

## [`0.3.0-13`](https://github.com/larsgw/citation.js/compare/v0.3.0-12...v0.3.0-13) - 2017-08-22

### Added
* Support for matching several tokens in a row with TokenStack

### Refactored
* Add explanation to complex code
* BibTeX publication type parsing now uses a type map

### Fixed
* Typo in BibTeX de-escaping code, now correctly parsing % signs in author fields
* False positive parsing Array JSON string as Bib.TXT

## [`0.3.0-12`](https://github.com/larsgw/citation.js/compare/v0.3.0-11...v0.3.0-12) - 2017-08-01

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

## [`0.3.0-11`](https://github.com/larsgw/citation.js/compare/v0.3.0-10...v0.3.0-11) - 2017-07-28

### Added
* Custom templates & locales register

### Fixed
* Use correct date format

## [`0.3.0-10`](https://github.com/larsgw/citation.js/compare/v0.3.0-9...v0.3.0-10) - 2017-07-28

### Added
* DOI support
* CSL normaliser

### Fixed
* Async prop parsing

## [`0.3.0-9`](https://github.com/larsgw/citation.js/compare/v0.3.0-8...v0.3.0-9) - 2017-07-06

### Added
* CLI stdin input

### Fixed
* DOM HTML output
* CLI non-file input

## [`0.3.0-8`](https://github.com/larsgw/citation.js/compare/v0.3.0-7...v0.3.0-8) - 2017-06-03

### Added
* Iterator to Cite

### Fixed
* CLI Windows support
* Wikidata input when value is empty
* DOM HTML output
* Output JSON is now valid JSON
* Sorting by callback and custom props
* Input support for BibTeX JSON

## [`0.3.0-7`](https://github.com/larsgw/citation.js/compare/v0.3.0-6...v0.3.0-7) - 2017-05-22

### Added
* Bib.TXT i/o support

### Fixed
* CLI Citation.js v0.3.0-7 support

## [`0.3.0-6`](https://github.com/larsgw/citation.js/compare/v0.3.0-5...v0.3.0-6) - 2017-05-15

### Added
* Async support

### Fixed
* Increased browser support

## [`0.3.0-5`](https://github.com/larsgw/citation.js/compare/v0.3.0-4...v0.3.0-5) - 2017-05-08

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
