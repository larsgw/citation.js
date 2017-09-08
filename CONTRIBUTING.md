# Contributing

First of all, thanks for considering contributing. Contributions are very welcome. Below is some hopefully helpful information.

Support questions are fine too, as there isn't a thing set up for that yet. Also, it usually starts a conversation resulting in new bug reports and feature suggestions, which are always welcome. However, [Stack Overflow](https://stackoverflow.com) may also be worth considering.

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
