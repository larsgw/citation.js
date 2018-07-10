```
citation-js  [options]

Options:

  -h, --help                      output usage information
  -V, --version                   output the version number
  
  -i, --input <path>              Input file
  -u, --url <url>                 Input url
  -t, --text <string>             Input text
  
  -o, --output <path>             Output file (omit file extension)
  
  -R, --output-non-real           Do not output the file in its mime type, but as a string
  -f, --output-type <option>      Output structure type: string, html, json
  -s, --output-style <option>     Output scheme. A combination of --output-format json and --output-style citation-* is considered invalid. Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)
  -l, --output-language <option>  Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
```
## Install

The CLI can be installed with

    npm install --global citation-js

or

    npm i -g citation-js

for short.

## Input

Input can be read from `stdin`, passed as a file with `-i, --input <path>` or, for simple IDs, as plain text with `-t, --text` or the deprecated alias `-u, --url`.

    $ echo "Q30000000" > input.txt
    
    $ cat input.txt | citation-js
    [{"title": "The Synergistic Activity ...", ...}]

    $ citation-js --input input.txt
    [{"title": "The Synergistic Activity ...", ...}]

    $ citation-js --text Q30000000
    [{"title": "The Synergistic Activity ...", ...}]

## Output

The CLI outputs to `stdout` by default, but can write to a file with the `-o, --output` option.

    $ citation-js --text Q30000000
    [{"title": "The Synergistic Activity ...", ...}]
    
    $ citation-js -t Q30000000 -o output
    $ more output.json
    [{"title": "The Synergistic Activity ...", ...}]

> Note: the file extension is determined automatically, and should therefore be omitted in the `-o` option. To force a file extension, simply omit `-o` and redirect `stdout` to the preferred file.

## Output Format

To format the output, use the `-R`, `-s`, `-f` and `-l` options. These options map to the {@tutorial output_options}.

| CLI option              | Default value    | `Cite` output option |
|-------------------------|------------------|----------------------|
| `-R, --output-non-real` | omitted (`real`) | `format`             |
| `-f, --output-type`     | `json`           | `type`               |
| `-s, --output-style`    | `csl`            | `style`              |
| `-l, --output-language` | `en-US`          | `lang`               |

For example, to format [doi:10.5281/zenodo.1005176](https://doi.org/10.5281/zenodo.1005176) in French in the APA format:

    $ citation-js -t 10.5281/zenodo.1005176 -f string -s citation-apa -l fr-FR

    Willighagen, L., & Willighagen, E. (2017,  octobre 9). Larsgw/Citation.Js V0.3.3. Zenodo. https://doi.org/10.5281/zenodo.1005176

> Note: the `-f` option is mandatory here, because the default value (`json`) is incompatible with the style used (`citation-apa`)

> Note: yes, that's a HTML entity. [I'm working on that.](https://github.com/larsgw/citation.js/issues/74)
