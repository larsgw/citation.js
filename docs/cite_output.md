To format data in a `Cite` instance, you use the `Cite#format()` method.

```js
let cite = new Cite('10.5281/zenodo.1005176')

cite.format('citation')
// '(Willighagen & Willighagen, 2017)'
```

You can also pass options:

```js
cite.format('citation', {
  format: 'html'
})
// '(Willighagen &#38; Willighagen, 2017)'
```

With these options you can also change style, for example:

```js
cite.format('citation', {
  template: 'vancouver'
})
// '(1)'
```

## Examples

Some more examples. First, let's create the `Cite` instance itself:

```js
let example = new Cite('10.5281/zenodo.1005176')
```

Now, we can choose different {@tutorial output_formats output options} as a parameter to `Cite#format()`. Some examples:


  * Get output in CSL-JSON as a JS object

```js
> example.format('data', {format: 'object'})

< [{title: 'Citation.js', ...}]
```

  * Get output in HTML in APA-style

```js
> example.format('bibliography', {
    format: 'html',
    template: 'apa'
  })

< <div class="csl-bib-body">
    <div data-csl-entry-id="https://doi.org/10.5281/zenodo.1005176" class="csl-entry">Willighagen, L., &#38; Willighagen, E. (2017, October 9). Larsgw/Citation.Js V0.3.3. Zenodo. https://doi.org/10.5281/zenodo.1005176</div>
  </div>
```

  * Get output as a plain text BibTeX entry

```js
> example.format('bibtex')

< @article{Willighagen2017Larsgw/Citation.Js,
    author={Willighagen, Lars and Willighagen, Egon},
    doi={10.5281/zenodo.1005176},
    pages={--},
    publisher={Zenodo},
    title={{Larsgw/Citation.Js V0.3.3}},
    year=2017,
  }
```

  * Get output as RTF in APA-style

```js
// First, a different source, because the other source doesn't show much text styling
const example = new Cite('Q30000000')

> example.format('bibliography', {
    format: 'rtf',
    template: 'apa'
  })

< {\rtf Miccadei, S., De Leo, R., Zammarchi, E., Natali, P. G., & Civitareale, D. (2002). The Synergistic Activity of Thyroid Transcription Factor 1 and Pax 8 Relies on the Promoter/Enhancer Interplay. {\i{}Molecular Endocrinology}, {\i{}16}(4), 837\uc0\u8211{}846. https://doi.org/10.1210/MEND.16.4.0808}
```

A full list of output formats, including options, is available in {@tutorial output_formats}.

> Citation and bibliography formatting is done with the [citeproc-js engine](https://github.com/Juris-M/citeproc-js/) and [CSL](http://citationstyles.org).

## `Cite#get()`

Before `Cite#format()` there was `Cite#get()`, which was a mess. Documentation can be found {@tutorial output_options here}.
