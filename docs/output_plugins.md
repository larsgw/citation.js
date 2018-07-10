There are several ways to extend output. First of all, if you want to add citation styles or other locales for your citations, you can use {@tutorial output_plugins_csl}. CSL Plugins themselves are configurations of the CSL Output Plugin. General Output PLugins, used to add different formats (like BibTeX, Bib.TXT, BibJSON, etc.) can also be added. To extend most Output Plugins, you can add {@tutorial output_plugins_dict}.

## Output Plugins

Output plugins can be added like this:

```js
Cite.plugins.output.add(type, formatter)
```

Or with General Plugins, `ref` being the plugin name:

```js
Cite.plugins.add(ref, {
  output: {
    type: formatter
  }
})
```

### Options

| Option      | Description |
|-------------|-------------|
| `type`      | Format name |
| `formatter` | Formatter   |

#### `type`

Any string. Descriptive would be nice.

#### `formatter`

A function taking in an array of CSL-JSON, returning the product. Can use dictionaries, mentioned below. The signature is like below:

```js
formatter (csl[] data, ...options) {}
```

So the first argument is an array of CSL data, and then there are any number of configuring arguments. Usually only one is needed, but multiple are supported. Multiple options can be passed like this:

```js
cite.format('example', optionA, optionB)
```

### Standard formatter options

Most Output Plugins share some common options.

* The `format` (and possibly the `type`) options control the formatting language, e.g. HTML, plain text or RTF. How this is achieved (i.e. with or without Dictionary Plugins) is your choice.
* The `entry` option, if applicable, controls which entries get outputtted.
