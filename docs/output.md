Getting output from a `Cite` instance is documented in {@tutorial cite_output}. You can also use the formatters yourself.

```js
Cite.plugins.output.format(name, data, ...options)
```

Here `name` is an {@tutorial output_formats output format}, `data` an array of CSL-JSON, and `options` the options associated with the output format. They are documented in {@tutorial output_formats}.

To add your own output formats, or to extend existing ones, see {@tutorial output_plugins}.
