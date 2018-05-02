# Contributing

First of all, thanks for considering contributing. Contributions are very welcome. Below is some hopefully helpful information.

Support questions are fine too, as there isn't a thing set up for that yet. Also, it usually starts a conversation resulting in new bug reports and feature suggestions, which are always welcome. However, [Stack Overflow](https://stackoverflow.com) may also be worth considering.

## Installing

To install for development, it's probably best to clone this repo:

    git clone https://github.com/larsgw/citation.js.git

Install dependencies:

    npm install

Then you can run the scripts available in `package.json`:

* `test` runs the Mocha suite
  * `test:live` doesn't mock http(s) requests
  * `test:update` updates the mocking data
  * To update mocking data for individual APIs `test:update:doi` and `test:update:wikidata` 
* `compile` runs Babel (necessary for the repo to work as a module)
* `lint` runs the code linter
  * `lint:src` does it for the source files
  * `lint:test` does it for the test suite
  * `lint:tools` does it for the various scripts
  * `lint:bin` does it for the CLI
* The following bundles can be created:
  * `dist:regular-main` bundles the source files
  * `dist:debug` does the same but with source maps
  * `dist:regular-test` bundles the test suite
  * To minify, run:
    * `dist:minify-main` minifies the source file bundle
    * `dist:minify-test` minifies the test suite bundle
  * Combine this like so:
    * `dist:regular` creates all bundles
    * `dist:minify` minifies all bundles
    * `dist:main` bundles and minifies the source files
    * `dist:test` bundles and minifies the test suite.
    * `dist` creates and minifies all bundles
* Generating other files is done like this:
  * `generate:files` is an alias for `dist` mentioned above
  * `generate:docs` generates the JSDoc files
  * `generate:disc` generates the bundle disc visualisation
  * `generate` generates everything mentioned above

You can run a given script with:

    npm run SCRIPT_NAME

## Reporting bugs

When filing an issue, make sure to answer these questions:

1. What version of Citation.js are you using?
2. What version of Node and what OS are you using?
  * If you're not comfortable with sharing OS info, note that it probably only matters for CLI and dev issues anyway
3. What did you do? (this includes input data, configuration, etc.)
4. What did you expect to see?
5. What actually happened?

## Suggesting features

Citation.js is becoming a more modular library to parse and output different bibliography formats, selecting formats according to your own needs.

When suggesting a new feature, make sure to answer these questions:

* What feature would you like to see?
* What are some expected use cases?
* How should it work?

## Pull requests

PRs are welcome. Please do follow the conventions:

* Code style is "[standard](https://standardjs.com/)"
* Commit message is `[SCOPE(:SUBSCOPE)] Message` with an optional explanation and/or `Fixes/Closes #n` on a new line for issues. Examples:
  * `[input:wikidata] Add support for qualifiers`
    `Closes #14`
  * `[output] Fix DOM HTML Element TypeError`
    `Was referencing incorrect variables`
    `Fixes #15`
