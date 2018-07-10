With Citation.js, you can parse input in a number of different ways:

1. You can pass the data to the `Cite` constructor {@tutorial cite_constructor}
2. You can create a `Cite` instance asynchronously with `Cite.async()` {@tutorial cite_constructor}
3. You can pass the data to the `Cite#add()` and `Cite#set()` methods, returning the modified `Cite` instance. See {@tutorial cite_data}
4. You can pass the data to `Cite.input()` and `Cite.inputAsync()`, returning CSL-JSON. See below

The available formats are documented in {@tutorial input_formats}. To add your own formats, see {@tutorial input_plugins}.

## `Cite.input[Async]()`

You can parse input data with `Cite.input()`, which returns CSL-JSON:

```js
let json = Cite.input('10.5281/zenodo.1005176')

> json
< [{title: 'Citation.js', DOI: '10.5281/zenodo.1005176', ...}]
```

There is also an async variant, `Cite.parseAsync()`, that returns a `Promise`.

```js
let json = await Cite.inputAsync('10.5281/zenodo.1005176')

> json
< [{title: 'Citation.js', DOI: '10.5281/zenodo.1005176', ...}]
```

Input parsing in Citation.js works by:

1. Determining the input format (this can be bypassed with {@tutorial input_options `forceType`})
2. If it's CSL-JSON, you're done. Else, proceed.
3. Parse the input. Go back to step 1. (this step is limited by the {@tutorial input_options `maxChainLength`} option.

This repetition of parsing is called a "chain". There are also functions to parse only a single chainlink. These are currently accessible as `Cite.plugins.input.chainLink[Async]()`, and work similarly. Note that the conversion of `@else/list+object` (i.e. a "miscellaneous" array) to `@csl/list+object` (i.e. the end product) is considered _one_ step.
